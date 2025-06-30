// 크롤러 인터페이스 import
import { Crawler, SearchResult } from './crawlers';
import { generateObject } from 'ai';
import { compact } from 'lodash-es';
import pLimit from 'p-limit';
import { z } from 'zod';

import { getModel, trimPrompt } from './ai/providers';
import { systemPrompt } from './prompt';

function log(...args: any[]) {
  console.log(...args);
}

export type ResearchProgress = {
  currentDepth: number;
  totalDepth: number;
  currentBreadth: number;
  totalBreadth: number;
  currentQuery?: string;
  totalQueries: number;
  completedQueries: number;
};

type ResearchResult = {
  learnings: string[];
  visitedUrls: string[];
};

// increase this if you have higher API rate limits
const ConcurrencyLimit = Number(process.env.CRAWLER_CONCURRENCY) || 2;

// 크롤러 타입 (환경 변수에서 가져오거나 기본값 사용)
const crawlerType = process.env.CRAWLER_TYPE || 'crawl4ai';

// 디버그 로그 추가
console.log('크롤러 초기화 정보:');
console.log('크롤러 타입:', crawlerType);

// 크롤러 인스턴스 (lazy loading)
let crawlerInstance: Crawler | null = null;

// 크롤러 인스턴스 가져오기
async function getCrawlerInstance(): Promise<Crawler> {
  if (!crawlerInstance) {
    const { getCrawler } = await import('./crawlers');
    crawlerInstance = await getCrawler(crawlerType as any);
  }
  return crawlerInstance;
}

// take en user query, return a list of SERP queries
async function generateSerpQueries({
  query,
  numQueries = 3,
  learnings,
}: {
  query: string;
  numQueries?: number;

  // optional, if provided, the research will continue from the last learning
  learnings?: string[];
}) {
  const res = await generateObject({
    model: getModel(),
    system: systemPrompt(),
    prompt: `Given the following prompt from the user, generate a list of SERP queries to research the topic. Return a maximum of ${numQueries} queries, but feel free to return less if the original prompt is clear. Make sure each query is unique and not similar to each other: <prompt>${query}</prompt>\n\n${
      learnings
        ? `Here are some learnings from previous research, use them to generate more specific queries: ${learnings.join(
            '\n',
          )}`
        : ''
    }`,
    schema: z.object({
      queries: z
        .array(
          z.object({
            query: z.string().describe('The SERP query'),
            researchGoal: z
              .string()
              .describe(
                'First talk about the goal of the research that this query is meant to accomplish, then go deeper into how to advance the research once the results are found, mention additional research directions. Be as specific as possible, especially for additional research directions.',
              ),
          }),
        )
        .describe(`List of SERP queries, max of ${numQueries}`),
    }),
  });
  log(`Created ${res.object.queries.length} queries`, res.object.queries);

  return res.object.queries.slice(0, numQueries);
}

async function processSerpResult({
  query,
  result,
  numLearnings = 3,
  numFollowUpQuestions = 3,
}: {
  query: string;
  result: SearchResult;
  numLearnings?: number;
  numFollowUpQuestions?: number;
}) {
  // 1. 검색 결과(markdown) 추출
  const contents = compact(result.data.map(item => item.markdown));
  log(`Ran ${query}, found ${contents.length} contents`);
  
  // 문서가 없는 경우 빈 결과 반환
  if (contents.length === 0) {
    log(`No contents found for query: ${query}`);
    return {
      learnings: [],
      followUpQuestions: [],
    };
  }

  // 2. 각 문서별 개별 요약 생성
  log(`Generating individual summaries for ${contents.length} documents...`);
  const learningsPerDoc = await Promise.all(
    contents.map(async (content, index) => {
      try {
        // 각 문서 내용 길이 제한 (원래보다 더 많이 허용)
        const trimmedContent = trimPrompt(content, 40_000);
        
        // 개별 문서에 대한 요약 생성
        const docRes = await generateObject({
          model: getModel(),
          abortSignal: AbortSignal.timeout(30_000), // 개별 문서는 시간 단축
          system: systemPrompt(),
          prompt: `Given the following content from a search result for the query "${query}", generate 2-3 key learnings from this specific document. Make the learnings concise, detailed and information-dense. Include any entities, metrics, numbers, or dates.

<content>
${trimmedContent}
</content>`,
          schema: z.object({
            documentLearnings: z.array(z.string()).describe('2-3 key learnings from this document'),
          }),
        });
        
        log(`Document ${index + 1}: Generated ${docRes.object.documentLearnings.length} learnings`);
        return docRes.object.documentLearnings;
      } catch (error) {
        log(`Error processing document ${index + 1}:`, error);
        return []; // 오류 발생 시 빈 배열 반환하여 계속 진행
      }
    }),
  );

  // 3. 모든 개별 요약 통합 (평면화)
  const allDocumentLearnings = learningsPerDoc.flat();
  log(`Total individual learnings generated: ${allDocumentLearnings.length}`);

  // 4. 전체 통합 요약 생성
  const res = await generateObject({
    model: getModel(),
    abortSignal: AbortSignal.timeout(60_000),
    system: systemPrompt(),
    prompt: trimPrompt(
      `Given the following list of learnings from multiple documents found in a search for "${query}", synthesize them into ${numLearnings} key consolidated learnings and ${numFollowUpQuestions} follow-up questions.

The consolidated learnings should represent the most important information across all documents, avoiding redundancy. Make them concise, detailed and information-dense. Include any entities, metrics, numbers, or dates.

The follow-up questions should help explore aspects of the topic that weren't fully covered in these learnings.

<individual_learnings>
${allDocumentLearnings.map(learning => `- ${learning}`).join('\n')}
</individual_learnings>`,
    ),
    schema: z.object({
      learnings: z.array(z.string()).describe(`List of consolidated learnings, max of ${numLearnings}`),
      followUpQuestions: z
        .array(z.string())
        .describe(
          `List of follow-up questions to research the topic further, max of ${numFollowUpQuestions}`,
        ),
    }),
  });
  
  log(`Created ${res.object.learnings.length} consolidated learnings and ${res.object.followUpQuestions.length} questions`);
  return res.object;
}

export async function writeFinalReport({
  prompt,
  learnings,
  visitedUrls,
}: {
  prompt: string;
  learnings: string[];
  visitedUrls: string[];
}) {
  const learningsString = learnings
    .map(learning => `<learning>\n${learning}\n</learning>`)
    .join('\n');

  const res = await generateObject({
    model: getModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `Given the following prompt from the user, write a final report on the topic using the learnings from research. Make it as as detailed as possible, aim for 3 or more pages, include ALL the learnings from research:\n\n<prompt>${prompt}</prompt>\n\nHere are all the learnings from previous research:\n\n<learnings>\n${learningsString}\n</learnings>`,
    ),
    schema: z.object({
      reportMarkdown: z.string().describe('Final report on the topic in Markdown'),
    }),
  });

  // Append the visited URLs section to the report
  const urlsSection = `\n\n## Sources\n\n${visitedUrls.map(url => `- ${url}`).join('\n')}`;
  return res.object.reportMarkdown + urlsSection;
}

export async function writeFinalAnswer({
  prompt,
  learnings,
}: {
  prompt: string;
  learnings: string[];
}) {
  const learningsString = learnings
    .map(learning => `<learning>\n${learning}\n</learning>`)
    .join('\n');

  const res = await generateObject({
    model: getModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `Given the following prompt from the user, write a final answer on the topic using the learnings from research. Follow the format specified in the prompt. Do not yap or babble or include any other text than the answer besides the format specified in the prompt. Keep the answer as concise as possible - usually it should be just a few words or maximum a sentence. Try to follow the format specified in the prompt (for example, if the prompt is using Latex, the answer should be in Latex. If the prompt gives multiple answer choices, the answer should be one of the choices).\n\n<prompt>${prompt}</prompt>\n\nHere are all the learnings from research on the topic that you can use to help answer the prompt:\n\n<learnings>\n${learningsString}\n</learnings>`,
    ),
    schema: z.object({
      exactAnswer: z
        .string()
        .describe('The final answer, make it short and concise, just the answer, no other text'),
    }),
  });

  return res.object.exactAnswer;
}

export async function deepResearch({
  query,
  breadth,
  depth,
  learnings = [],
  visitedUrls = [],
  onProgress,
}: {
  query: string;
  breadth: number;
  depth: number;
  learnings?: string[];
  visitedUrls?: string[];
  onProgress?: (progress: ResearchProgress) => void;
}): Promise<ResearchResult> {
  const progress: ResearchProgress = {
    currentDepth: depth,
    totalDepth: depth,
    currentBreadth: breadth,
    totalBreadth: breadth,
    totalQueries: 0,
    completedQueries: 0,
  };

  const reportProgress = (update: Partial<ResearchProgress>) => {
    Object.assign(progress, update);
    onProgress?.(progress);
  };

  const serpQueries = await generateSerpQueries({
    query,
    learnings,
    numQueries: breadth,
  });

  reportProgress({
    totalQueries: serpQueries.length,
    currentQuery: serpQueries[0]?.query,
  });

  const limit = pLimit(ConcurrencyLimit);

  const results = await Promise.all(
    serpQueries.map(serpQuery =>
      limit(async () => {
        try {
          const crawler = await getCrawlerInstance();
          const result = await crawler.search(serpQuery.query, {
            timeout: 30000, // 타임아웃 시간 증가
            limit: 10, // 검색 결과 개수 증가
            scrapeOptions: { 
              formats: ['markdown'], 
              maxTokens: 100000, // 페이지당 최대 토큰 수 증가
            },
          });

          // Collect URLs from this search
          const newUrls = compact(result.data.map(item => item.url));
          const newBreadth = Math.ceil(breadth / 2);
          const newDepth = depth - 1;

          const newLearnings = await processSerpResult({
            query: serpQuery.query,
            result,
            numLearnings: 5, // 기본값 3에서 5로 증가
            numFollowUpQuestions: newBreadth,
          });
          const allLearnings = [...learnings, ...newLearnings.learnings];
          const allUrls = [...visitedUrls, ...newUrls];

          if (newDepth > 0) {
            log(`Researching deeper, breadth: ${newBreadth}, depth: ${newDepth}`);

            reportProgress({
              currentDepth: newDepth,
              currentBreadth: newBreadth,
              completedQueries: progress.completedQueries + 1,
              currentQuery: serpQuery.query,
            });

            const nextQuery = `
            Previous research goal: ${serpQuery.researchGoal}
            Follow-up research directions: ${newLearnings.followUpQuestions.map(q => `\n${q}`).join('')}
          `.trim();

            return deepResearch({
              query: nextQuery,
              breadth: newBreadth,
              depth: newDepth,
              learnings: allLearnings,
              visitedUrls: allUrls,
              onProgress,
            });
          } else {
            reportProgress({
              currentDepth: 0,
              completedQueries: progress.completedQueries + 1,
              currentQuery: serpQuery.query,
            });
            return {
              learnings: allLearnings,
              visitedUrls: allUrls,
            };
          }
        } catch (e: any) {
          console.error(`[CASCADE DEBUG] Full error for query "${serpQuery.query}":`, JSON.stringify(e, null, 2));
          if (e.message && e.message.includes('Timeout')) {
            log(`Timeout error running query: ${serpQuery.query}: `, e);
          } else {
            log(`Error running query: ${serpQuery.query}: `, e);
          }
          return {
            learnings: [],
            visitedUrls: [],
          };
        }
      }),
    ),
  );

  return {
    learnings: [...new Set(results.flatMap(r => r.learnings))],
    visitedUrls: [...new Set(results.flatMap(r => r.visitedUrls))],
  };
}
