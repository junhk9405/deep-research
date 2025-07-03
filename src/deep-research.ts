// 크롤러 인터페이스 import
import { Crawler, SearchResult } from './crawlers';
import { generateObject } from 'ai';
import { compact } from 'lodash-es';
import pLimit from 'p-limit';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { generateComprehensiveReport } from './comprehensive-report-generator';

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
  comprehensiveReport?: string; // 새로 추가
  reportPaths?: string[]; // 새로 추가
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
  const firstLevelPrompt = `You are conducting an initial broad search to explore the topic across the 6 core strategic dimensions listed below.

    Generate 6 search queries in English — one for each of the following business-critical strategic dimensions:
    TOPIC ANCHOR
    Each query MUST:
      • Add only dimension-specific terms that relate directly to this topic.
      • Exclude unrelated or broader synonyms.

    Solution Overview & Market Analysis
    — solution scope and functional definition, global and Korean market size with growth rates (TAM/SAM/CAGR), primary value proposition, and major application areas across industries

    Customer Intelligence & Business Case  
    — target customer segmentation taxonomy (industry, size, geography), quantified pain-point severity and business impact, ROI case studies and success stories, plus customer willingness-to-pay indicators

    Technology Landscape & Trends
    — latest technology trends and emerging innovations for 2024-2025, core technology stack patterns and architecture options, technology maturity assessment, and open-source ecosystem plus standardization status

    Competitive Technology Analysis
    — major competitors and market leaders with technology positioning, competitive feature comparison and technical capabilities, vendor ecosystem and partnership landscape, plus differentiation opportunities and competitive advantages

    Technology Implementation & ROI
    — proven implementation methodologies and best practices, development challenges and technical risk mitigation, quantified cost-benefit analysis with ROI calculation examples, and scalability plus performance benchmark data

    Risk & Regulatory Analysis
    — technical limitations and implementation risks, current and upcoming regulatory requirements plus compliance standards, security and privacy concerns with data protection, and market entry barriers plus adoption challenges

    Each query should view the user’s topic through the lens of the corresponding strategic dimension.`; // (위 내용 그대로)
  const secondLevelPrompt = `You are conducting a focused second-level search on the dimension: **${parentDimension}**
    Generate ${numQueries} follow-up search queries in English (3–10 words each) that:
    - Generate search queries by selecting one sub-topic under each **"${parentDimension}"** below:
    
    Solution Overview
    Solution Overview & Market Analysis:
    1-1. Solution Definition & Core Features (functionality, technical specs, capabilities)
    1-2. Market Size & Growth Dynamics (TAM/SAM/CAGR, growth drivers, geographic trends)
    1-3. Value Proposition & Competitive Position (differentiation, market positioning)
    1-4. Industry Applications & Use Cases (verticals, scenarios, adoption patterns)

    Customer Intelligence & Business Case:
    2-1. Customer Segmentation & Personas (target segments, decision-makers, buyer journey)
    2-2. Pain Points & Business Impact (problems, severity metrics, current costs)
    2-3. ROI & Business Value (quantified ROI, payback periods, efficiency gains)
    2-4. Success Stories & Case Studies (testimonials, reference customers, proven results)

    Technology Landscape & Trends:
    3-1. Latest Technology Trends & Roadmap (2024-2025 trends, emerging innovations)
    3-2. Technology Stack & Architecture (components, patterns, infrastructure requirements)
    3-3. Technology Maturity & Standards (readiness level, industry standards, protocols)
    3-4. Ecosystem & Open Source (developer community, open-source projects, integrations)

    Competitive Technology Analysis:
    4-1. Major Competitors & Market Leaders (key players, market share, positioning)
    4-2. Technology Feature Comparison (feature comparison, technical capabilities, benchmarks)
    4-3. Vendor Ecosystem & Partnerships (partner networks, integrations, alliances)
    4-4. Differentiation & Competitive Advantage (USPs, market gaps, opportunities)

    Technology Implementation & ROI:
    5-1. Implementation Methodology & Best Practices (deployment approaches, frameworks)
    5-2. Development Challenges & Solutions (obstacles, risk mitigation, problem-solving)
    5-3. Cost-Benefit Analysis & ROI Calculation (costs, TCO, ROI methods, examples)
    5-4. Performance & Scalability Benchmarks (metrics, optimization, capacity planning)

    Risk & Regulatory Analysis:
    6-1. Technical Risks & Limitations (technology limits, failure modes, reliability)
    6-2. Regulatory & Compliance Requirements (regulations, standards, certifications)
    6-3. Security & Privacy Concerns (cybersecurity, data privacy, protection measures)
    6-4. Market Barriers & Adoption Challenges (entry barriers, adoption obstacles, change management)
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
                "SolutionOverviewMarketAnalysis",
                "CustomerIntelligenceBusinessCase",
                "TechnologyLandscapeTrends",
                "CompetitiveTechnologyAnalysis",
                "TechnologyImplementationROI",
                "RiskRegulatoryAnalysis"
              ]).describe("The strategic dimension this query focuses on."),
              query: z.string().describe('Simple, broad search query (3-7 words, covering key aspects of the topic).'),
              researchGoal: z
                .string()
                .describe(
                  'Brief goal of this research query and what insights we expect to find.',
                ),
            })
          )
          .length(6) // 1차 검색: 6가지 디멘션 강제
          .describe(`List of 6 simple, broad SERP queries covering different strategic aspects.`)
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

// src/deep-research.ts의 processSerpResult 함수 - 소스 자동 추가 완성 버전
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
  // 1. URL과 내용을 함께 보존
  const contentsWithSources = result.data
    .filter(item => item.markdown && item.url)
    .slice(0, 10)  // 개수 제한
    .map((item, index) => ({
      sourceId: index + 1,
      url: item.url,
      title: item.title || item.url,
      content: item.markdown!
    }));
  
  log(`[DEBUG] Processing ${contentsWithSources.length} contents in single step`);
  
  if (contentsWithSources.length === 0) {
    return {
      learnings: [`## No Search Results\n\nNo valid search results found for query: "${query}".`],
      followUpQuestions: [`What alternative keywords could be used for ${query}?`],
    };
  }

  // 2. 모든 크롤링 결과를 URL과 함께 하나로 결합
  const combinedContentWithSources = contentsWithSources.map(item => 
    `---
## Source [${item.sourceId}]: ${item.title}
**URL**: ${item.url}

${item.content}
`
  ).join('\n\n');

  // 3. AI에게 전체 내용을 한 번에 전달 (본문만 작성하도록 지시)
  const res = await generateObject({
    model: getResearchModel(),
    abortSignal: AbortSignal.timeout(90_000),
    system: systemPrompt(),
    prompt: trimPrompt(
      `Extract and organize key insights for the search query "${query}".

## Core Principles (Anti-Hallucination)
1. **Extract ONLY information explicitly stated in sources** - No speculation or inference
2. **Preserve exact facts** - Don't rephrase or interpret beyond what sources say
3. **Mandatory citations** - Every claim must end with [number] format

## CRITICAL: Content Extraction Rule
**Extract more when you have more**: Rich, comprehensive source material demands thorough, extensive extraction - don't leave valuable information on the table.

## Target Format: Structured Information Extraction
Organize findings by importance and relevance, NOT by creating artificial narrative flow.

**Structure:**
- Use ## section headings for major topic areas (only when you have substantial content)
- Under each section, present individual key insights as separate, complete statements
- Each insight should be self-contained and factually complete
- Prioritize by importance/impact rather than forcing logical connections

**Individual Insight Format:**
[Complete factual statement with specific details]. [Additional context if provided in source]. [source number]

## STRICTLY FORBIDDEN
- ❌ Artificial connecting phrases like "Furthermore", "Additionally", "Moreover" 
- ❌ Inferring relationships not explicitly stated in sources
- ❌ Creating topic transitions or narrative flow
- ❌ Bullet points or fragmentary lists
- ❌ Adding interpretations beyond source content

## REQUIRED Approach
- ✅ Extract each important fact as a complete, standalone statement
- ✅ Preserve specific numbers, percentages, and concrete details exactly as stated
- ✅ Group related facts under appropriate headings when sufficient content exists
- ✅ Present insights in order of importance/relevance to the query
- ✅ Include context only when explicitly provided in sources
- ✅ End each factual statement with [number] citation

**Scale Guideline**: Extract more insights and details when sources are comprehensive; fewer when sources are limited.

<combined_search_results>
${combinedContentWithSources}
</combined_search_results>

Extract key insights as complete, factual statements. Focus on information density rather than narrative coherence.`
    ),
    schema: z.object({
      detailedSummary: z.string().describe('Main analysis content with citations, WITHOUT Sources section'),
      followUpQuestions: z.array(z.string()).max(numFollowUpQuestions),
    }),
  });

  // 🔥 4. 코드에서 자동으로 Sources 섹션 생성 (퍼플렉시티 스타일)
  let finalSummary = res.object.detailedSummary;
  
  // Sources 섹션이 이미 있는지 체크 (중복 방지)
  if (!finalSummary.toLowerCase().includes('## sources') && 
      !finalSummary.toLowerCase().includes('# sources')) {
    
    // 퍼플렉시티 스타일의 Sources 섹션 추가
    const sourcesSection = '\n\n---\n\n## Sources\n\n' + 
      contentsWithSources.map(source => {
        // 제목이 URL과 다르면 "제목 - URL" 형태, 같으면 URL만
        if (source.title && source.title !== source.url && !source.title.startsWith('http')) {
          return `${source.sourceId}. ${source.title} - ${source.url}`;
        } else {
          return `${source.sourceId}. ${source.url}`;
        }
      }).join('\n');
    
    finalSummary = finalSummary + sourcesSection;
  }
  
  log(`[DEBUG] Generated analysis with ${contentsWithSources.length} auto-appended sources`);
  
  return {
    learnings: [finalSummary],
    followUpQuestions: res.object.followUpQuestions,
  };
}



export async function writeFinalAnswer({
  prompt,
  learnings,
}: {
  prompt: string;
  learnings: string[];
}) {
  const model = getAnswerModel();

  const learningsString = learnings
    .map(learning => `<learning>\n${learning}\n</learning>`)
    .join('\n');

  const { object: answer } = await generateObject({
    model,
    system: systemPrompt(),
    prompt: trimPrompt(
      `Please write a comprehensive, easy-to-read, and in-depth answer to the following question. The answer should be written in Korean and in markdown format. The answer should be based on the following learnings. You can also use your own knowledge to supplement the answer.\n\nQuestion: ${prompt}\n\nLearnings:\n${learningsString}`,
    ),
    schema: z.object({
      answer: z.string(),
    }),
  });

  return answer.answer;
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
          const newBreadth = Math.ceil(breadth - 2);
          const newDepth = depth - 1;

          // 🆕 크롤러 타입에 따라 분기 처리 추가
          let newLearnings;

          if (crawlerType === 'perplexity') {
            // Perplexity는 이미 완성된 요약이므로 processSerpResult 스킵
            const perplexityContent = result.data[0]?.markdown || '';
            
            // 간단한 후속 질문만 생성
            const followUpRes = await generateObject({
              model: getResearchModel(),
              system: systemPrompt(),
              prompt: `Based on this research about "${serpQuery.query}", generate ${newBreadth} follow-up research questions to explore deeper.

          Research content: ${trimPrompt(perplexityContent, 5000)}`,
              schema: z.object({
                followUpQuestions: z.array(z.string()).describe('Follow-up research questions'),
              }),
            });

            newLearnings = {
              learnings: [perplexityContent], // 🔥 Perplexity 결과 그대로 사용
              followUpQuestions: followUpRes.object.followUpQuestions,
            };
          } else {
            // 기존 크롤러들은 기존 방식으로 처리
            newLearnings = await processSerpResult({
              query: serpQuery.query,
              result,
              numLearnings: 10,
              numFollowUpQuestions: newBreadth,
            });
          }

          // 함수 지움
          /* const newLearnings = await processSerpResult({
            // 기존 processSerpResult 호출 부분 유지
            query: serpQuery.query,
            result,
            numLearnings: 10, // 기본값 5에서 10으로 증가 (내용 보존을 위해)
            numFollowUpQuestions: newBreadth,
          }); */

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
              breadth: Math.ceil(breadth - 2),
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

  const finalResult: ResearchResult = {
    learnings: [...new Set(results.flatMap(r => r.learnings))],
    visitedUrls: [...new Set(results.flatMap(r => r.visitedUrls))],
  };

  // 🆕 최초 깊이에서만 comprehensive report 생성
  if (depth === (originalDepth || depth)) {
    try {
      console.log('🎯 Generating comprehensive report...');
      const safeInitialQuery = (initialQuery || query).replace(/[\/\?%\*:\|"<>\.]/g, '').replace(/\s+/g, '_');

      const comprehensiveResult = await generateComprehensiveReport({
        prompt: initialQuery || query,
        learnings: finalResult.learnings,
        visitedUrls: finalResult.visitedUrls,
        options: {
          includeDimensionReports: true,
          includeConsolidatedReport: true,
          includeStrategicReport: true,
          outputDirectory: path.join('report', safeInitialQuery)
        }
      });

      finalResult.comprehensiveReport = comprehensiveResult.strategicReport || comprehensiveResult.consolidatedReport;
      finalResult.reportPaths = comprehensiveResult.reportPaths;

    } catch (error) {
      console.error('⚠️ Comprehensive report generation failed:', error);
      // 실패해도 기본 결과는 반환
    }
  }

  return finalResult;
}
