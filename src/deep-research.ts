// 크롤러 인터페이스 import
import { Crawler, SearchResult } from './crawlers';
import { generateObject } from 'ai';
import { compact } from 'lodash-es';
import pLimit from 'p-limit';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'node:fs/promises';

import { getModel, getQueryModel, getResearchModel, getReportModel, getAnswerModel, trimPrompt } from './ai/providers';
import { systemPrompt } from './prompt'; // systemPrompt import

function log(...args: any[]) {
  console.log(...args);
}

/**
 * 검색어 메타데이터를 통합 구조체로 저장
 * 1차/2차 검색을 모두 하나의 파일에 누적 저장
 */
async function saveSearchQueries(
  folderPath: string, 
  queries: any[], 
  depth: number,
  maxDepth: number,
  parentDimension?: string
) {
  try {
    // 프로젝트 루트 디렉토리로 이동 (report/프로젝트명/)
    const projectRootPath = path.dirname(folderPath);
    const queryFilePath = path.join(projectRootPath, 'queries.json');
    const projectName = path.basename(projectRootPath);
    
    // 기존 파일 읽기 (없으면 초기 구조 생성)
    let searchData: any;
    try {
      const existingData = await fs.readFile(queryFilePath, 'utf-8');
      searchData = JSON.parse(existingData);
    } catch {
      // 파일이 없으면 새로운 구조 생성
      searchData = {
        projectInfo: {
          projectName,
          startTime: new Date().toISOString(),
          totalDepth: maxDepth
        },
        searchHistory: {
          "1차검색": null,
          "2차검색": {}
        }
      };
    }
    
    const currentTime = new Date().toISOString();
    const folderName = depth === maxDepth ? 'Middle' : `FollowUp_${maxDepth - depth}`;
    const isInitialSearch = depth === maxDepth;
    
    const querySection = {
      depth,
      folderName,
      timestamp: currentTime,
      parentDimension: parentDimension || null,
      totalQueries: queries.length,
      queries: queries.map((q, index) => ({
        index: index + 1,
        query: q.query,
        dimension: q.dimension || null,
        researchGoal: q.researchGoal || null,
        expectedResultFile: null
      }))
    };
    
    if (isInitialSearch) {
      // 1차 검색: 전체 저장
      searchData.searchHistory["1차검색"] = querySection;
    } else {
      // 2차 검색: 해당 dimension에만 저장
      const dimensionKey = parentDimension
        ? parentDimension.replace(/[^a-zA-Z0-9가-힣]/g, '').replace(/\s+/g, '')
        : `Unknown_${Date.now()}`;
      
      searchData.searchHistory["2차검색"][dimensionKey] = querySection;
    }
    
    // 파일 저장
    await fs.writeFile(queryFilePath, JSON.stringify(searchData, null, 2), 'utf-8');
    log(`✅ Search queries saved: ${queryFilePath} (${isInitialSearch ? '1차검색' : '2차검색-' + parentDimension})`);
    
  } catch (error) {
    console.warn(`⚠️ Failed to save search queries: ${error}`);
  }
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

export type ResearchResult = {
  learnings: string[];
  visitedUrls: string[];
};

// increase this if you have higher API rate limits
const ConcurrencyLimit = Number(process.env.CRAWLER_CONCURRENCY) || 3;

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

// take en user query, return a list of SERP queries, 일단 numqueries는 3개에서 변경함. 
export async function generateSerpQueries({
  query,
  numQueries = 3,
  learnings,
  useDimensions = true,
  parentDimension, // 디멘션 사용 여부 (1차 검색에서는 true, 2차 검색에서는 false)
}: {
  query: string;
  numQueries?: number;
  // optional, if provided, the research will continue from the last learning
  learnings?: string[];
  useDimensions?: boolean;
  parentDimension?: string;
}) {
    // ✅ 1. 먼저 검색 모드 판별
  const isFirstLevel = !parentDimension || parentDimension.trim() === '';

  // ✅ 2. 프롬프트 블록 정의
  const firstLevelPrompt = `You are conducting an initial broad search to explore the topic across the 5 core strategic dimensions listed below.

    Generate 5 search queries in English — one for each of the following business-critical strategic dimensions:
    TOPIC ANCHOR
    Each query MUST:
      • Add only dimension-specific terms that relate directly to this topic.
      • Exclude unrelated or broader synonyms.

    Solution Overview
    — solution scope and functional definition, Korean-language search insights on competing offerings, evidence of unmet needs and pain-point intensity, and the high-level value proposition that closes the gap

    Market Landscape & Growth Dynamics
    — global & regional TAM/SAM with CAGR figures, industry or geographic break-outs, core business-value drivers and inhibitors, plus funding/M&A trends shaping adoption timing

    Customer Segmentation & Demand Analysis
    — segmentation taxonomy and key personas, quantified pain-point severity (frequency × cost), willingness-to-pay indicators, and adoption triggers across size, industry, or region

    Technology Assessment & Business Value
    — core and emerging technology options with illustrative use cases, integration complexity and benchmark references (latency, cost, team size), scalability/talent readiness, and ROI or cost-benefit differentials per technology

    Risk & Regulatory Snapshot
    — technology and market entry barriers, data-privacy & sector-specific regulations, forthcoming compliance or AI-governance timelines, cybersecurity/ethical risks, and recommended mitigation guidelines

    Each query should view the user’s topic through the lens of the corresponding strategic dimension.`; // (위 내용 그대로)
  const secondLevelPrompt = `You are conducting a focused second-level search on the dimension: **${parentDimension}**
    Generate ${numQueries} follow-up search queries in English (3–10 words each) that:
    - Generate search queries by selecting one sub-topic under each **"${parentDimension}"** below:
    Solution Overview
    1-1. Solution definition & scope (what the solution does)
    1-2. Korean-language search findings and competitive snapshot
    1-3. Evidence of unmet needs & high-level value proposition

    Market Landscape & Growth Dynamics
    2-1. Global and Korean TAM/SAM with CAGR figures
    2-2. Business value drivers and inhibitors shaping adoption
    2-3. Investment, funding and M&A trends across the value chain

    Customer Segmentation & Demand Analysis
    3-1. Customer Segmentation (industry, size, geography)
    3-2. Current pain points / jobs-to-be-done and severity metrics
    3-3. Quantified demand, willingness-to-pay and adoption triggers

    Technology Assessment & Business Value
    4-1. Core and emerging technologies with illustrative use cases
    4-2. Implementation complexity & benchmark references (latency, cost, team size)
    4-3. Business value per technology (ROI, cost-savings, revenue lift)

    Risk & Regulatory Snapshot
    5-1. Technology entry barriers and inherent limitations
    5-2. Market entry barriers and competitive moats
    5-3. Regulatory, compliance and policy risks
    `; // (위 내용 그대로)
  const res = await generateObject({
    model: getQueryModel(),
    system: systemPrompt(),
    prompt: `Given the user query, extract key concepts and generate simple, broad search queries that cover the topic comprehensively. 
User Query: ${query}
Parent Dimension: ${parentDimension}

Step 1 — Determine the search mode:

- If **parentDimension is not provided** (i.e., it is null or empty), this is an **initial broad exploration** step.  
  You should generate **one query per strategic dimension** to explore the topic from all relevant angles.
  Please Be sure to stay focused on the user's topic. 
  
- If **parentDimension is provided**, it indicates the current research is a **follow-up deep dive** focused on that specific strategic dimension.  
  You should generate **multiple follow-up queries** targeting only that dimension.

Regardless of the mode, follow these principles:
- Always include the topic keyword from the original query in every generated search query.
- Keep each query short and simple (min 4 ~ max 12 words)
- Avoid redundancy — do not repeat similar queries or rephrase the same idea
- Ensure each query targets a **unique, meaningful aspect** of the topic

${(isFirstLevel ? firstLevelPrompt : secondLevelPrompt)}

${learnings ? 
  `\nPrevious research context:\n${learnings.slice(0, 2).join('\n\n')}\n\nBased on this context, generate queries that explore gaps or expand on key findings.` 
  : ''
}`,
    schema: z.object({
      queries: useDimensions 
        ? z.array(
            z.object({
              dimension: z.enum([
                "Solution Overview",
                "Market Landscape & Growth Dynamics",
                "Customer Segmentation & Demand Analysis",
                "Technology Assessment & Business Value",
                "Risk & Regulatory Snapshot"
              ]).describe("The strategic dimension this query focuses on."),
              query: z.string().describe('Simple, broad search query (3-7 words, covering key aspects of the topic).'),
              researchGoal: z
                .string()
                .describe(
                  'Brief goal of this research query and what insights we expect to find.',
                ),
            })
          )
          .length(5) // 1차 검색: 5가지 디멘션 강제
          .describe(`List of 5 simple, broad SERP queries covering different strategic aspects.`)
        : z.array( // 2차 검색: dimension 필드 완전 제거
            z.object({
              query: z.string().describe('Simple follow-up search query (3-10 words).'),
              researchGoal: z.string().describe('Brief goal of this follow-up research.'),
            })
          )
          .min(1)
          .max(numQueries)
          .describe(`List of simple follow-up queries for deeper research.`),
    }),
  });
  log(`Created ${res.object.queries.length} queries`, res.object.queries);

  return res.object.queries.slice(0, numQueries);
}
// numLearnings, Fup Questions 는 2개로 변경
export async function processSerpResult({
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
  // 1. 검색 결과 디버깅 로그 추가
  log(`[DEBUG] Processing SERP result for query: "${query}"`);
  log(`[DEBUG] Raw result data length: ${result.data?.length || 0}`);
  log(`[DEBUG] Raw result structure:`, JSON.stringify(result, null, 2).substring(0, 500) + '...');
  
  // 2. 검색 결과(markdown) 추출 - 최대 5개로 제한
  const contents = compact(result.data.map(item => item.markdown)).slice(0, 10);
  log(`[DEBUG] Extracted contents length: ${contents.length} (limited to 5)`);
  
  // 각 콘텐츠의 길이도 확인
  contents.forEach((content, index) => {
    log(`[DEBUG] Content ${index + 1} length: ${content?.length || 0} chars`);
  });
  
  // 문서가 없는 경우 빈 결과 반환
  if (contents.length === 0) {
    log(`[ERROR] No contents found for query: ${query}`);
    log(`[ERROR] Available data fields:`, Object.keys(result.data[0] || {}));
    return {
      learnings: [],
      followUpQuestions: [],
    };
  }

  // 2. 각 문서별 개별 요약 생성 - 동시성 제한으로 순차 처리
  log(`Generating individual summaries for ${contents.length} documents...`);
  const docLimit = pLimit(3); // 문서 처리 동시성을 5개로 제한
  const learningsPerDoc = await Promise.all(
    contents.map((content, index) =>
      docLimit(async () => {
        try {
          // 각 문서 내용 길이 제한 - 토큰 수 축소
          const trimmedContent = trimPrompt(content, 50_000);
          
          // 개별 문서에 대한 요약 생성
          const docRes = await generateObject({
            model: getResearchModel(),
            abortSignal: AbortSignal.timeout(60_000), // 타임아웃 증가
            system: systemPrompt(),
            prompt: `Given the following content from a search result for the query "${query}", generate at least more than 10 key learnings from this specific document. Make the learnings precise, detailed and information-dense. Include any entities, metrics, numbers, or dates.

<content>
${trimmedContent}
</content>`,
            schema: z.object({
              documentLearnings: z.array(z.string()).describe('key learnings from this document'),
            }),
          });
          
          log(`Document ${index + 1}: Generated ${docRes.object.documentLearnings.length} learnings`);
          return docRes.object.documentLearnings;
        } catch (error) {
          log(`Error processing document ${index + 1}:`, error);
          return []; // 오류 발생 시 빈 배열 반환하여 계속 진행
        }
      })
    ),
  );

  // 3. 모든 개별 요약 통합 (평면화)
  const allDocumentLearnings = learningsPerDoc.flat();
  log(`[DEBUG] Total individual learnings generated: ${allDocumentLearnings.length}`);

  // 4. 빈 데이터 처리 - 개별 학습 내용이 없는 경우 안전장치
  if (allDocumentLearnings.length === 0) {
    log(`[ERROR] No individual learnings generated for query: ${query}`);
    return {
      learnings: [`## 검색 결과 없음\n\n검색어 "${query}"에 대한 유효한 검색 결과를 찾을 수 없었습니다. 다른 키워드나 검색 방식을 시도해보시기 바랍니다.`],
      followUpQuestions: [`${query}와 관련된 다른 검색 키워드는 무엇인가요?`],
    };
  }

  // 5. 전체 통합 요약 생성 (줄글 형식)
  const res = await generateObject({
    model: getResearchModel(),
    abortSignal: AbortSignal.timeout(90_000), // 상세한 작성을 위해 타임아웃 증가
    system: systemPrompt(),
    prompt: trimPrompt(
      `Using only the sentences inside <individual_learnings>, write a coherent narrative for the search query: “${query}.”
      You are a precise information extractor. Your primary goal is accuracy over length.

      ## Core Principles
      1. **Only use information explicitly present in sources**
      2. **Never generate content beyond what sources provide**
      3. **Quality over quantity - shorter accurate content is better than longer fabricated content**
      4. **Output in English unless otherwise specified**

      ## Extraction Rules

      1. **Information Gathering**
        - Extract meaningful chunks of information (2-4 sentences) that form complete thoughts
        - Combine directly related facts from the same source into coherent paragraphs
        - Keep statistical data, quotes, and specific claims intact
        - Preserve important context that appears immediately around key facts

      2. **Expansion Guidelines** (ONLY when source material allows)
        - If sources contain explanations, include them
        - If sources show cause-effect relationships, preserve them
        - If sources provide examples or comparisons, retain them
        - DO NOT create explanations, examples, or relationships not in sources

      3. **Structure**
        - Use ## topical headings based on actual content available
        - Under each heading:
          * Group related information from sources
          * Maintain logical flow by ordering facts sensibly
          * If only 1-2 facts exist for a topic, that's acceptable
        - Skip sections entirely if insufficient information exists

      4. **Length Management**
        - Target length: As long as source material supports (typically 600-1500 words)
        - Each section: Include what sources provide, no minimum requirement
        - If a topic has limited information, keep it brief
        - Never pad content to meet length targets

      5. **Anti-Hallucination Safeguards**
        - Before writing each sentence, verify it exists in sources
        - Use these markers when needed:
          * "[정보 없음]" - when expected information is missing
          * "[추가 정보 부족]" - when a topic seems incomplete
          * "[원문 참조 필요]" - when sources hint at more detail not provided
        - If unsure whether information is from sources or inference, exclude it

      6. **Citation Rules** 
        1. Format – Append citations as (Source: …) or (Sources: …, …) after each fact-bearing sentence or paragraph.
        2. Acceptable source strings MUST satisfy at least one of the following:
            a) Widely recognized organisation, company, or government body
              e.g. Gartner, OECD, Microsoft
            b) Established journal, conference, or media outlet with optional year
              e.g. Nature 2024, IEEE ICCV 2023, MIT Technology Review
            c) Clear top-level domain of a reputable entity
              e.g. who.int, nasa.gov, ft.com, arxiv.org
        3. Special cases
            • arXiv cite as arXiv 2409.14858 2024 or arXiv.org – Paper Title
            • Datasets or repositories include provider and dataset or repo name
              e.g. Kaggle – Titanic Survival
        4. Disallowed identifiers omit the statement if only these are available:
            • Pure numbers or version strings 2409.14858v1, 2020, 1, 3, 5
            • Random codes or hashes SRTE57145DR, abc123
            • Generic words content, article, data, report
        5. Multiple sources separate with commas
            e.g. (Sources: Gartner 2024, arXiv 2409.14858 2024)
        6. Authority first favour facts backed by authoritative, reputable sources; ignore information that cannot be cited with a compliant identifier.

      7. **Information Density Check**
        - Acceptable to have short sections if sources are limited
        - Acceptable to have fewer sections if content is sparse
        - NOT acceptable to invent content to fill space
        - Focus on extracting all available valuable information rather than creating narrative

      ## Final Verification
      Before outputting, check each statement:
      - Can I point to the exact source sentence(s)?
      - Am I combining facts or creating new connections not in sources?
      - Would removing this statement lose source information?

      Remember: Your users prefer complete but concise information over lengthy but partially fabricated content..
      
      \\n\n<individual_learnings>\n${allDocumentLearnings.map(learning => `- ${learning}`).join('\n')}\n</individual_learnings>`,
    ),
    schema: z.object({
      detailedSummary: z.string().describe('A detailed, structured summary in Korean with appropriate section headers (## format). Each section should contain comprehensive narrative content while preserving original information details.'),
      followUpQuestions: z
        .array(z.string())
        .describe(
          `List of follow-up questions to research the topic further, max of ${numFollowUpQuestions}`,
        ),
    }),
  });

  // 생성된 상세 요약문을 배열에 담아 기존 구조와 호환되도록 함
  const learnings = [res.object.detailedSummary];
  log(`[DEBUG] Created a detailed summary and ${res.object.followUpQuestions.length} questions`);
  
  return {
    learnings,
    followUpQuestions: res.object.followUpQuestions,
  };
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
    model: getReportModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `이전 검색에서 얻은 모든 조사 내용을 바탕으로, 주제에 대한 심층 기술 전략 보고서를 한국어로 작성하십시오. 
       검색 내용에는 불필요한 내용 혹은 주제와 무관한 내용도 있을 수 있지만, 필요한 정보를 잘 취사선택하는 것도 당신의 능력입니다.

      You are an AI Research Agent assigned to prepare an in-depth, structured report to support high-level business decision-making for a specific IT solution.

      The report must be comprehensive, evidence-based, and reflect all relevant research findings. It should include a minimum of 15 pages of detailed content, organized under the following sections:

      ---

      ### Report Structure & Section Goals

      1. **Executive Summary & Strategic Rationale**  
        - One-sentence mission & “why now” argument  
        - Three key take-aways / decisions

      2. **Market & Competitive Insights**  
        - Market size & CAGR   
        - Demand drivers / blockers & customer pain points  
        - 3 leading competitors & white-space  

      3. **Technology Assessment & Fit-Gap**  
        - Two or three pivotal tech trends 
        - Capabilities-vs-requirements  (build / buy / partner)  
        - Integration feasibility & scalability constraints  

      4. **Business Value & ROI Outlook**  
        - Cost-saving & revenue-uplift levers 
        - High-level financial model: base vs. stretch scenario  
        - Payback period & two to three headline KPIs  

      5. **High-Level Roadmap (12–36 months)**  
        - Phase 0: PoC goal & success metric  
        - Phase 1: MVP launch (quarter, budget, team size)  
        - Phase 2: Scale & optimize (optional)  

      6. **Risks & Governance**  
        - Top five risks (tech / market / compliance) with mitigations  
        - Ownership (RACI) snapshot & monthly KPI review cadence  

      ---
      Strictly follow these writing guidelines for every section:
      - Use Markdown headings for each main section
      - Each Sub-sections should include at least 2–3 full paragraphs.
      - Each section should contain at least 4–5 detailed paragraphs.
      - Important!: Every paragraph must adopt a **Claim** → **Multiple Evidences** flow
      - In the Evidences part, **provide as many distinct data points, studies, expert quotes, or case examples as are credibly available (3개 이상이 바람직)**, weaving them into a persuasive narrative rather than a mere list.
      - Each paragraph must have written in well-formed, narrative sentences.
      - Provide concrete explanations and deep analysis, not surface-level summaries.
      - Include quantitative data, statistics, industry examples, and use structured elements like tables and bullet lists where appropriate
            - In the Roadmap section, develop clear short-/mid-/long-term execution plans (not just listing facts)
            - The combined word count of tables/figures must NOT exceed 30% of the section.

      All information must be synthesized into original insight—not copied or paraphrased. Avoid bullet-style or brief summaries as the main format. Every section must contain rich explanation and thoughtful discussion.
      **Please write your response in Korean.**

      Here is the result of All learnings. <learnings>\n${learningsString}\n</learnings>
      `,
    ),
    schema: z.object({
      reportMarkdown: z.string().describe('Comprehensive, detailed strategic report on the topic in Markdown format with extensive analysis and insights'),
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
    model: getAnswerModel(),
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
  solutionContext, // 이 부분이 solutionContext로 사용됨
  query, // 이 부분이 initialQuery로 사용됨
  breadth,
  depth,
  learnings = [], // 이전 depth에서 누적된 learnings
  visitedUrls = [], // 이전 depth에서 누적된 visitedUrls
  onProgress,
  initialQuery, // 최초 사용자 쿼리 보존용
  originalDepth, // 최초 depth 값 보존용
  parentDimension, // 1차 검색의 디멘션 정보
}: {
  solutionContext?: string;
  query: string;
  breadth: number;
  depth: number;
  learnings?: string[];
  visitedUrls?: string[];
  onProgress?: (progress: ResearchProgress) => void;
  initialQuery?: string; // 최초 사용자 쿼리 보존용
  originalDepth?: number; // 최초 depth 값 보존용
  parentDimension?: string; // 1차 검색의 디멘션 정보
}): Promise<ResearchResult> {
  // originalDepth가 없으면 현재 depth를 최초 depth로 설정
  const maxDepth = originalDepth || depth;
  
  const progress: ResearchProgress = {
    currentDepth: depth,
    totalDepth: maxDepth, // 최초 depth 값 사용
    currentBreadth: breadth,
    totalBreadth: breadth,
    totalQueries: 0,
    completedQueries: 0,
  };

  const reportProgress = (update: Partial<ResearchProgress>) => {
    Object.assign(progress, update);
    onProgress?.(progress);
  };

  // 1차 검색은 useDimensions: true, 2차 검색(depth < maxDepth)은 useDimensions: false
  const isInitialSearch = depth === maxDepth;
  
  const serpQueries = await generateSerpQueries({
    query,
    learnings,
    numQueries: breadth,
    useDimensions: isInitialSearch, // 2차 검색부터는 디멘션 사용 안 함
    parentDimension, // parentDimension 전달 추가
  });

  reportProgress({
    totalQueries: serpQueries.length,
    currentQuery: serpQueries[0]?.query,
  });

  const limit = pLimit(ConcurrencyLimit);

  // 하위 보고서 저장 디렉토리 생성 로직 추가
  // 최초 사용자 쿼리를 사용하여 폴더명 생성 (재귀 호출 시에도 동일한 폴더 사용)
  const queryForFolder = initialQuery || query;
  let safeInitialQuery = queryForFolder.replace(/[\/\?%\*:\|"<>\.]/g, '').replace(/\s+/g, '_');
  // Windows의 MAX_PATH 오류를 방지하기 위해 디렉토리 이름 부분의 최대 길이를 제한합니다.
  // MAX_PATH는 약 260자이며, 기본 경로, 'report', '<검색어>', 'Middle', 일반적인 파일 이름을 제외하면
  // 이 부분에 약 150자 정도를 사용할 수 있습니다.
  const MAX_DIR_PART_LENGTH = 100;
  if (safeInitialQuery.length > MAX_DIR_PART_LENGTH) {
    safeInitialQuery = safeInitialQuery.substring(0, MAX_DIR_PART_LENGTH);
    // 잘라낸 후 마지막에 남아있을 수 있는 '_' 문자들을 제거합니다.
    safeInitialQuery = safeInitialQuery.replace(/_+$/, '');
  }
  
  const getFolderName = (currentDepth: number, maxDepth: number) => {
    if (currentDepth === maxDepth) {
      return 'Middle'; // 1차 검색 (최초 depth)
    } else {
      const followUpLevel = maxDepth - currentDepth;
      return `FollowUp_${followUpLevel}`; // 2차: FollowUp_1, 3차: FollowUp_2, ...
    }
  };
  
  const folderName = getFolderName(depth, maxDepth);
  const subReportDir = path.join('report', safeInitialQuery, folderName);
  await fs.mkdir(subReportDir, { recursive: true });

  // 🔍 검색어 메타데이터 저장 (기존 코드에 영향 없음)
  await saveSearchQueries(subReportDir, serpQueries, depth, maxDepth, parentDimension);

  const results = await Promise.all(
    serpQueries.map(serpQuery =>
      limit(async () => {
        try {
          const crawler = await getCrawlerInstance();
          const crawlerType = process.env.CRAWLER_TYPE || 'perplexity';

          let result: SearchResult;
          if (crawlerType === 'perplexity') {
            // perplexity search가 모든 것을 처리
            result = await crawler.search(serpQuery.query);
          } else if (crawlerType === 'firecrawl') {
            // firecrawl search가 모든 것을 처리 (perplexity와 동일)
            result = await crawler.search(serpQuery.query, {
              timeout: 30000,
              limit: 10,
              scrapeOptions: { 
                formats: ['markdown'],
                // maxTokens 제거 - Firecrawl v1 API에서 지원하지 않음
              },
            });
          } else {
            // 기존 크롤러들 (google, crawl4ai)은 search 후 crawl 필요
            result = await crawler.search(serpQuery.query, {
              timeout: 30000, // 타임아웃 시간 증가
              limit: 10, // 검색 결과 개수를 10개로 제한
              scrapeOptions: { 
                formats: ['markdown'], 
                maxTokens: 100000, // 페이지당 최대 토큰 수 증가
              },
            });
          }

          // Collect URLs from this search
          const newUrls = compact(result.data.map(item => item.url));
          // breadth 계산 원래대로 유지 (2차 검색도 breadth 값 사용)
          const newBreadth = Math.ceil(breadth / 2);
          const newDepth = depth - 1;

          const newLearnings = await processSerpResult({
            // 기존 processSerpResult 호출 부분 유지
            query: serpQuery.query,
            result,
            numLearnings: 10, // 기본값 5에서 10으로 증가 (내용 보존을 위해)
            numFollowUpQuestions: newBreadth,
          });
          const allLearnings = [...learnings, ...newLearnings.learnings];
          const allUrls = [...visitedUrls, ...newUrls];

          // 하위 주제 결과 파일 저장 로직 추가
          if (newLearnings.learnings.length > 0) {
            // 1차 검색인지 확인 (originalDepth와 현재 depth 비교)
            const isInitialSearch = depth === (originalDepth || depth);
            
            // 디버깅 로그 추가
            if ('dimension' in serpQuery && serpQuery.dimension === 'Core Technology & Architecture') {
              console.log('\n=== CoreTechnologyArchitecture 디버깅 ===');
              console.log('followUpQuestions:', newLearnings.followUpQuestions);
              console.log('learnings length:', newLearnings.learnings.length);
              console.log('newDepth:', newDepth);
              console.log('newBreadth:', newBreadth);
            }
            
            // 파일명 생성 로직 개선: 디멘션 기반 고유 파일명
            let fileNamePrefix: string;
            
            if (isInitialSearch && 'dimension' in serpQuery && typeof serpQuery.dimension === 'string') {
              // 1차 검색: 디멘션 기반 파일명
              fileNamePrefix = serpQuery.dimension.replace(/[^a-zA-Z0-9_\-가-힣]/g, '').replace(/\s+/g, '_');
            } else if (parentDimension) {
              // 2차 검색: 부모 디멘션 + 인덱스 기반 파일명
              const dimensionSlug = parentDimension.replace(/[^a-zA-Z0-9_\-가-힣]/g, '').replace(/\s+/g, '_');
              // 간단한 인덱스 생성 (현재 시간 기반으로 고유성 보장)
              const timeIndex = Date.now().toString().slice(-4);
              const queryIndex = progress.completedQueries + 1;
              fileNamePrefix = `${dimensionSlug}_${queryIndex}_${timeIndex}`;
            } else {
              // 기본 fallback
              fileNamePrefix = `Query_${progress.completedQueries + 1}`;
            }
            
            const subReportFileName = `${fileNamePrefix}.md`;
            const subReportFilePath = path.join(subReportDir, subReportFileName);
            try {
              await fs.writeFile(subReportFilePath, newLearnings.learnings.join('\n\n---\n\n'), 'utf-8');
              log(`Sub-report saved: ${subReportFilePath}`);
            } catch (writeError) {
              console.error(`Error writing sub-report ${subReportFilePath}:`, writeError);
            }
          }

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

            return await deepResearch({
              query: nextQuery,
              breadth: Math.ceil(breadth / 2),
              depth: depth - 1,
              learnings: allLearnings,
              visitedUrls: allUrls,
              onProgress,
              solutionContext, // 누락되지 않도록 solutionContext 전달
              initialQuery: initialQuery || query, // 최초 사용자 쿼리 전달
              originalDepth: maxDepth, // 최초 depth 값 전달
              parentDimension: parentDimension || 
                ('dimension' in serpQuery && typeof serpQuery.dimension === 'string' 
                  ? serpQuery.dimension 
                  : undefined), // 상위 디멘션이 있으면 유지, 없으면 serpQuery.dimension 사용
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
