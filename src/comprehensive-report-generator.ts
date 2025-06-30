/**
 * 통합 리포트 생성기
 * Deep Research 결과를 받아서 한 번에 모든 형태의 리포트를 생성
 * - Dimension별 전문 리포트
 * - 통합 리포트 (ConsolidatedReport)  
 * - 전략적 Executive 리포트 (StrategicReport)
 */

import { generateObject } from 'ai';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { getReportModel, trimPrompt } from './ai/providers';
import { systemPrompt } from './prompt';

// PDF 생성을 위한 import (선택적)
let mdToPdf: any = null;
try {
  mdToPdf = require('md-to-pdf').mdToPdf;
} catch (error) {
  // md-to-pdf가 없어도 계속 동작
  console.warn('md-to-pdf not installed. PDF generation will be skipped.');
}

// Dimension 매핑 테이블
const DIMENSION_MAPPING = {
  'SolutionOverview': 'Solution Overview',
  'MarketLandscapeGrowthDynamics': 'Market Landscape & Growth Dynamics',
  'CustomerSegmentationDemandAnalysis': 'Customer Segmentation & Demand Analysis',
  'TechnologyAssessmentBusinessValue': 'Technology Assessment & Business Value',
  'RiskRegulatorySnapshot': 'Risk & Regulatory Snapshot'
};

// 고정된 목차 순서
const FIXED_DIMENSION_ORDER = [
  'Solution Overview',
  'Market Landscape & Growth Dynamics',
  'Customer Segmentation & Demand Analysis', 
  'Technology Assessment & Business Value',
  'Risk & Regulatory Snapshot'
];

// Dimension별 전용 프롬프트 템플릿
const DIMENSION_PROMPTS = {
  'Solution Overview': `
**Solution Overview 파트 리포트**

IT솔루션션 분석 전문 컨설턴트로서, 솔루션 설명 리포트 파트를 아래 항목에 따라 구체적으로 작성해주세요.
검색/조사 내용을 잘 읽고, 상세한 문단을 작성하고, 구체적인 데이터와 통계, 사례를 포함해주세요.
목차에는 없지만, 중요한 내용이라고 판단되는 경우 그 외 인사이트에 정리해주세요.
- 핵심만 담아주세요 전체 보고서의 일부분으로 너무 많은 내용들을 담을 필요는 없습니다. 
- 다만 핵심내용이라고 판단되는 경우 모르는 사람도 이해할 수 있을 정도로 자세히 서술하는 것이 필수적입니다.

파트목차는 아래와 같지만, 실제 작성시에는 두괄식으로 아래 내용이 주장하는 것을 함축적으로 요약해서 읽기 쉬운 형식으로 작성해주세요.
- 목차는 아래와 같고, 세부 목차는 최대 3개 정도로 제한해주세요. (정말 필요한 경우에만 그 이상 확대가능)
1.1 Solution Definition & Scope
1.2 KR Scope & Market Fit
1.3 Unmet Needs & Value Proposition
(정말 중요한 이슈인 경우에만 작성, 아니면 작성 X) 그 외 인사이트

`,

  'Market Landscape & Growth Dynamics': `
**Market Landscape & Growth Dynamics 파트 리포트**

시장 분석가로서, 심층 시장 리포트 파트를 아래 항목에 따라 구체적으로 작성해주세요.
검색/조사 내용을 잘 읽고, 상세한 문단을 작성하고, 구체적인 데이터와 통계, 사례를 포함해주세요.
목차에는 없지만, 중요한 내용이라고 판단되는 경우 그 외 인사이트에 정리해주세요.
- 핵심만 담아주세요 전체 보고서의 일부분으로 너무 많은 내용들을 담을 필요는 없습니다. 
- 다만 핵심내용이라고 판단되는 경우 모르는 사람도 이해할 수 있을 정도로 자세히 서술하는 것이 필수적입니다.

파트목차는 아래와 같지만, 실제 작성시에는 두괄식으로 아래 내용이 주장하는 것을 함축적으로 요약해서 읽기 쉬운 형식으로 작성해주세요.
- 목차는 아래와 같고, 세부 목차는 최대 3개 정도로 제한해주세요. (정말 필요한 경우에만 그 이상 확대가능)
2.1 Market Size & CAGR (Global)
2.2 Market Size & CAGR (Korea)
2.3 Value Drivers & Adoption Barriers
2.4 Funding & M&A Trends
(정말 중요한 이슈인 경우에만 작성, 아니면 작성 X) 그 외 인사이트

`,

  'Customer Segmentation & Demand Analysis': `
**Customer Segmentation & Demand Analysis 파트 리포트**

시장/고객 분석가로서,심층 분석 리포트 파트를 아래 항목에 따라 구체적으로 작성해주세요.
검색/조사 내용을 잘 읽고, 상세한 문단을 작성하고, 구체적인 데이터와 통계, 사례를 포함해주세요.
목차에는 없지만, 중요한 내용이라고 판단되는 경우 그 외 인사이트에 정리해주세요.
- 핵심만 담아주세요 전체 보고서의 일부분으로 너무 많은 내용들을 담을 필요는 없습니다. 
- 다만 핵심내용이라고 판단되는 경우 모르는 사람도 이해할 수 있을 정도로 자세히 서술하는 것이 필수적입니다.

파트목차는 아래와 같지만, 실제 작성시에는 두괄식으로 아래 내용이 주장하는 것을 함축적으로 요약해서 읽기 쉬운 형식으로 작성해주세요.
- 목차는 아래와 같고, 세부 목차는 최대 3개 정도로 제한해주세요. (정말 필요한 경우에만 그 이상 확대가능)
3.1 Segment Taxonomy & Personas
3.2 Pain-point Severity (Cost·Freq.)
3.3 Demand & Willingness-to-Pay
(정말 중요한 이슈인 경우에만 작성, 아니면 작성 X) 그 외 인사이트

`,

  'Technology Assessment & Business Value': `
**Technology Assessment & Business Value 파트 리포트**

기술/사업 전문가로서, 기술 및 사업성 분석 리포트 파트를 아래 항목에 따라 구체적으로 작성해주세요.
검색/조사 내용을 잘 읽고, 상세한 문단을 작성하고, 구체적인 데이터와 통계, 사례를 포함해주세요.
목차에는 없지만, 중요한 내용이라고 판단되는 경우 그 외 인사이트에 정리해주세요.
- 핵심만 담아주세요 이 보고서는 **전체 보고서의 일부분**으로 너무 많은 내용들을 담을 필요는 없습니다. 
- 다만 핵심내용이라고 판단되는 경우 모르는 사람도 이해할 수 있을 정도로 자세히 서술하는 것이 필수적입니다.

파트목차는 아래와 같지만, 실제 작성시에는 두괄식으로 아래 내용이 주장하는 것을 함축적으로 요약해서 읽기 쉬운 형식으로 작성해주세요.
- 목차는 아래와 같고, 세부 목차는 최대 3개 정도로 제한해주세요. (정말 필요한 경우에만 그 이상 확대가능)
4.1 Core vs. Emerging Technologies
4.2 Implementation Complexity Benchmarks
4.3 Business Value by Technology (ROI)
(정말 중요한 이슈인 경우에만 작성, 아니면 작성 X) 그 외 인사이트
`,

  'Risk & Regulatory Snapshot': `
**Risk & Regulatory Snapshot 파트 리포트**

전략 분석가로서, 심층 ROI/리스크 분석 리포트 파트를 아래 항목에 따라 구체적으로 작성해주세요.
검색/조사 내용을 잘 읽고, 상세한 문단을 작성하고, 구체적인 데이터와 통계, 사례를 포함해주세요.
목차에는 없지만, 중요한 내용이라고 판단되는 경우 그 외 인사이트에 정리해주세요.
- 핵심만 담아주세요 전체 보고서의 일부분으로 너무 많은 내용들을 담을 필요는 없습니다. 
- 다만 핵심내용이라고 판단되는 경우 모르는 사람도 이해할 수 있을 정도로 자세히 서술하는 것이 필수적입니다.

파트목차는 아래와 같지만, 실제 작성시에는 두괄식으로 아래 내용이 주장하는 것을 함축적으로 요약해서 읽기 쉬운 형식으로 작성해주세요.
- 목차는 아래와 같고, 세부 목차는 최대 3개 정도로 제한해주세요. (정말 필요한 경우에만 그 이상 확대가능)
5.1 Regulatory & Compliance Risks
5.2 Tech / Market Entry Barriers
5.3 Mitigation Strategies & Timeline
(정말 중요한 이슈인 경우에만 작성, 아니면 작성 X) 그 외 인사이트
`
};

// 전략적 리포트 프롬프트
const STRATEGIC_PROMPT = `
당신은 전략 컨설팅 전문가입니다.

나는 특정 IT/AI기술과 관련된 조사내용 5개의 Dimension 개별보고서를 제공합니다.
당신의 주 역할은 **6번째 보고서 부분인, 기술/전략 Dimension 파트 보고서를 작성하는 것""입니다.

이 보고서 파트는 다음과 같은 내용을 포함해야 합니다:
6-1 후보 기술 선정 (3개 이하)
- 기존 기술 및 신기술 중 ROI나 시장 성장성, 기술 역량, 기술난이도, 성숙도 등을 고려하여 산정 (이유를 자세히 기술)
6-2 후보기술 개발계획 수립
- 후보 기술에 대한 개발 계획을 수립 (개발 기간, 필요 인력, 예산 등)
6-3 마일스톤
- 개발 완료 후, 시장 출시까지의 마일스톤을 설정 (각 단계별 목표 및 일정)

사업적인 관점에서 어떤 전략을 취해야 하는지에 대해 아래 당사 현황을 바탕으로 보고서를 작성해주세요.
- 보고서 전체 다양한 관점에서 내용을 꼼꼼하게 읽고 의사결정을 해주세요. 
- 각 섹션별로 최소 3-4개의 상세한 문단을 작성하고, 구체적인 데이터와 통계, 사례를 포함해주세요.
- 전문적이고 심층적인 분석을 제공해주세요.

- 당사 현황 - 
우리 기업은 매출 5,000억 영업이익 200억 원 수준의 
중견 IT/SI기업이며, 연간 약 20억을 투자하여 AI 사업진출을 검토 중입니다. 
 
`;

interface DimensionFile {
  filePath: string;
  content: string;
  dimension: string;
  level: string;
}

interface DimensionGroup {
  dimension: string;
  files: DimensionFile[];
  combinedContent: string;
}

interface DimensionReport {
  dimension: string;
  content: string;
  filePath: string;
}

interface ReportGenerationOptions {
  includeDimensionReports?: boolean;
  includeConsolidatedReport?: boolean;
  includeStrategicReport?: boolean;
  outputDirectory?: string;
}

/**
 * 프로젝트 폴더 스캔하여 Dimension별 파일 수집
 */
async function scanDimensionFiles(projectPath: string): Promise<DimensionFile[]> {
  const files: DimensionFile[] = [];
  const folders = ['Middle', 'FollowUp_1', 'FollowUp_2'];
  
  for (const folder of folders) {
    const folderPath = path.join(projectPath, folder);
    
    try {
      const folderExists = await fs.access(folderPath).then(() => true).catch(() => false);
      if (!folderExists) continue;
      
      const fileList = await fs.readdir(folderPath);
      
      for (const fileName of fileList) {
        if (fileName.endsWith('.md') && fileName !== 'README.md') {
          const filePath = path.join(folderPath, fileName);
          const content = await fs.readFile(filePath, 'utf-8');
          
          const dimension = extractDimensionFromFileName(fileName);
          if (dimension) {
            files.push({
              filePath,
              content,
              dimension,
              level: folder
            });
          }
        }
      }
    } catch (error) {
      console.warn(`폴더를 읽을 수 없습니다: ${folderPath}`, error);
    }
  }
  
  return files;
}

/**
 * 파일명에서 Dimension 추출
 */
function extractDimensionFromFileName(fileName: string): string | null {
  const baseName = fileName.replace('.md', '');
  const cleanName = baseName.replace(/_\d+_\d+$/, '');
  
  for (const [key, value] of Object.entries(DIMENSION_MAPPING)) {
    if (cleanName === key) {
      return value;
    }
  }
  
  return null;
}

/**
 * Dimension별로 파일 그룹핑
 */
function groupFilesByDimension(files: DimensionFile[]): DimensionGroup[] {
  const groups = new Map<string, DimensionFile[]>();
  
  for (const file of files) {
    if (!groups.has(file.dimension)) {
      groups.set(file.dimension, []);
    }
    groups.get(file.dimension)!.push(file);
  }
  
  return Array.from(groups.entries()).map(([dimension, files]) => ({
    dimension,
    files,
    combinedContent: files.map(f => f.content).join('\n\n---\n\n')
  }));
}

/**
 * Dimension별 전용 리포트 생성
 */
async function generateDimensionReport(group: DimensionGroup): Promise<string> {
  const prompt = DIMENSION_PROMPTS[group.dimension as keyof typeof DIMENSION_PROMPTS];
  
  if (!prompt) {
    throw new Error(`${group.dimension}에 대한 프롬프트가 정의되지 않았습니다.`);
  }
  
  console.log(`📊 Generating ${group.dimension} report...`);
  
  const res = await generateObject({
    model: getReportModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `${prompt}

**연구 자료:**
다음은 "${group.dimension}" 관련하여 수집된 연구 자료입니다.

<research_content>
${group.combinedContent}
</research_content>

위 연구 자료를 바탕으로 해당 Dimension에 특화된 전문 리포트를 한국어로 작성해주세요.

**작성 가이드라인:**
- 각 섹션별로 최소 3-4개의 상세한 문단 작성
- 구체적인 데이터, 통계, 사례를 포함
- 전문적이고 심층적인 분석 제공
- Markdown 형식으로 구조화
- 최소 2,000단어 이상의 상세한 내용
`
    ),
    schema: z.object({
      report: z.string().describe('Dimension에 특화된 상세한 전문 리포트 (Markdown 형식)'),
    }),
  });
  
  return res.object.report;
}

/**
 * 통합 리포트 생성 (ConsolidatedReport)
 */
async function generateConsolidatedReport(
  projectName: string, 
  dimensionReports: DimensionReport[]
): Promise<string> {
  const tableOfContents = `# ${projectName} - 종합 전략 분석 리포트

## 📋 목차

${dimensionReports.map((report, index) => 
  `${index + 1}. [${report.dimension}](#${index + 1}-${report.dimension.toLowerCase().replace(/[^a-z0-9]/g, '-')})`
).join('\n')}

---

`;

  const reportContents = dimensionReports.map((report, index) => 
    `## ${index + 1}. ${report.dimension}

${report.content}

---
`
  ).join('\n');

  return tableOfContents + reportContents;
}

/**
 * PDF 생성 함수 (안전하게 실행)
 */
async function generatePdfFromMarkdown(markdownPath: string, outputPath: string): Promise<boolean> {
  if (!mdToPdf) {
    console.log('📄 PDF generation skipped (md-to-pdf not available)');
    return false;
  }

  try {
    console.log('📄 Generating PDF...');
    
    const pdfOptions = {
      launch_options: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ],
        headless: true,
        timeout: 60000
      },
      pdf_options: {
        format: 'A4',
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        },
        printBackground: true,
        timeout: 60000,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; margin: auto;"></div>',
        footerTemplate: '<div style="font-size: 10px; margin: auto; color: #666;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
      },
      port: 0, // 랜덤 포트 사용
      css: `
        body {
          font-family: 'Noto Sans KR DemiLight', 'Noto Sans KR', '맑은 고딕', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
          font-size: 10pt;
          line-height: 1.5;
          color: #2d3748;
          font-weight: 400;
        }
        h1 {
          font-size: 14pt;
          font-weight: 700;
          color: #1a202c;
          margin-top: 24px;
          margin-bottom: 16px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }
        h2 {
          font-size: 12pt;
          font-weight: 600;
          color: #2d3748;
          margin-top: 20px;
          margin-bottom: 12px;
        }
        h3 {
          font-size: 11pt;
          font-weight: 600;
          color: #4a5568;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        p {
          margin-bottom: 8px;
          text-align: justify;
          color: #2d3748;
        }
        ul, ol {
          margin-bottom: 12px;
          padding-left: 20px;
        }
        li {
          margin-bottom: 4px;
          color: #2d3748;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
          font-size: 9pt;
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f7fafc;
          font-weight: 600;
          color: #2d3748;
        }
        blockquote {
          border-left: 4px solid #667eea;
          margin: 12px 0;
          padding-left: 16px;
          color: #4a5568;
          background-color: #f7fafc;
          padding: 12px 16px;
          border-radius: 4px;
        }
        code {
          background-color: #edf2f7;
          color: #e53e3e;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
          font-size: 9pt;
        }
        pre {
          background-color: #1a202c;
          color: #e2e8f0;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          font-size: 9pt;
        }
        strong {
          font-weight: 600;
          color: #1a202c;
        }
        em {
          font-style: italic;
          color: #4a5568;
        }
        a {
          color: #667eea;
          text-decoration: none;
        }
        @page {
          margin: 20mm;
        }
      `
    };

    const markdownContent = await fs.readFile(markdownPath, 'utf-8');
    
    // 재시도 로직 추가
    let lastError;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`📄 PDF generation attempt ${attempt}/2...`);
        const pdf = await mdToPdf({ content: markdownContent }, pdfOptions);
        
        if (pdf.content) {
          await fs.writeFile(outputPath, pdf.content);
          console.log(`✅ PDF created: ${path.basename(outputPath)}`);
          return true;
        }
      } catch (error) {
        lastError = error;
        console.log(`⚠️ Attempt ${attempt} failed, ${attempt < 2 ? 'retrying...' : 'giving up'}`);
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
        }
      }
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('❌ Failed to generate PDF:', error instanceof Error ? error.message : String(error));
    console.log('📄 PDF generation failed, but MD file was created successfully');
    return false;
  }
}

/**
 * 전략적 리포트 생성 (StrategicReport)
 */
async function generateStrategicReport(
  projectName: string, 
  dimensionReports: DimensionReport[]
): Promise<string> {
  console.log('🧠 AI가 전략적 재구성을 시작합니다...');
  
  const allContent = dimensionReports.map(dr => 
    `## ${dr.dimension}\n\n${dr.content}`
  ).join('\n\n---\n\n');

  const res = await generateObject({
    model: getReportModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `${STRATEGIC_PROMPT}

**프로젝트명**: ${projectName}

**분석 자료**:
${allContent}
`
    ),
    schema: z.object({
      strategicReport: z.string().describe('전략적으로 재구성된 Executive Report (Markdown 형식)'),
    }),
  });
  
  return res.object.strategicReport;
}

/**
 * 메인 통합 리포트 생성 함수
 * Deep Research 결과를 받아서 모든 형태의 리포트를 생성
 */
export async function generateComprehensiveReport({
  prompt,
  learnings,
  visitedUrls,
  options = {}
}: {
  prompt: string;
  learnings: string[];
  visitedUrls: string[];
  options?: ReportGenerationOptions;
}): Promise<{
  dimensionReports?: DimensionReport[];
  consolidatedReport?: string;
  strategicReport?: string;
  reportPaths: string[];
}> {
  // 기본 옵션 설정
  const {
    includeDimensionReports = true,
    includeConsolidatedReport = true,
    includeStrategicReport = true,
    outputDirectory = undefined
  } = options;

  console.log('🚀 Starting comprehensive report generation...');

  // 1. 프로젝트명 추출 (prompt에서)
  const projectName = prompt.split('\n')[0]?.replace('Initial Query: ', '').trim() || 'Research_Project';
  const safeProjectName = projectName.replace(/[^a-zA-Z0-9_\-가-힣]/g, '').replace(/\s+/g, '_');

  // 2. 출력 디렉토리 설정
  const baseOutputDir = outputDirectory || path.join('report', safeProjectName);
  const reportsDir = path.join(baseOutputDir, 'ComprehensiveReports');
  await fs.mkdir(reportsDir, { recursive: true });

  // 3. 프로젝트 디렉토리에서 Dimension 파일 스캔
  const dimensionFiles = await scanDimensionFiles(baseOutputDir);
  console.log(`📁 Found ${dimensionFiles.length} dimension files`);

  if (dimensionFiles.length === 0) {
    console.log('⚠️ No dimension files found. Generating fallback report...');
    // Fallback: learnings를 사용한 기본 리포트 생성
    return await generateFallbackReport(prompt, learnings, visitedUrls, reportsDir);
  }

  // 4. Dimension별 그룹핑
  const groups = groupFilesByDimension(dimensionFiles);
  console.log(`📊 Grouped into ${groups.length} dimensions`);

  const reportPaths: string[] = [];
  let dimensionReports: DimensionReport[] = [];

  // 5. Dimension별 리포트 생성 (병렬)
  if (includeDimensionReports) {
    console.log('📋 Generating dimension reports...');
    
    const dimensionResults = await Promise.all(
      groups.map(async (group) => {
        try {
          const report = await generateDimensionReport(group);
          
          const fileName = group.dimension.replace(/[^a-zA-Z0-9_\-가-힣]/g, '').replace(/\s+/g, '_') + '.md';
          const filePath = path.join(reportsDir, fileName);
          
          await fs.writeFile(filePath, report, 'utf-8');
          console.log(`✅ Generated: ${fileName}`);
          reportPaths.push(filePath);
          
          return {
            dimension: group.dimension,
            content: report,
            filePath
          };
          
        } catch (error) {
          console.error(`❌ Failed to generate ${group.dimension}:`, error);
          return null;
        }
      })
    );

    dimensionReports = dimensionResults.filter(Boolean) as DimensionReport[];
    
    // 고정된 순서로 정렬
    dimensionReports.sort((a, b) => {
      const aIndex = FIXED_DIMENSION_ORDER.indexOf(a.dimension);
      const bIndex = FIXED_DIMENSION_ORDER.indexOf(b.dimension);
      return aIndex - bIndex;
    });
  }

  let consolidatedReport: string | undefined;
  let strategicReport: string | undefined;

  // 6. 전략적 리포트 생성 (먼저 생성)
  if (includeStrategicReport && dimensionReports.length > 0) {
    console.log('🎯 Generating strategic report...');
    try {
      strategicReport = await generateStrategicReport(safeProjectName, dimensionReports);
      
      const strategicPath = path.join(reportsDir, 'StrategicReport.md');
      await fs.writeFile(strategicPath, strategicReport, 'utf-8');
      reportPaths.push(strategicPath);
      console.log(`✅ Strategic report created`);
    } catch (error) {
      console.error('❌ Failed to generate strategic report:', error);
    }
  }

  // 7. 통합 리포트 생성 (Strategic 포함)
  if (includeConsolidatedReport && dimensionReports.length > 0) {
    console.log('📄 Generating consolidated report...');
    try {
      // Strategic Report를 6번째로 포함
      const allReportsForConsolidation = strategicReport 
        ? [...dimensionReports, {
            dimension: 'Strategic Insights & Recommendations',
            content: strategicReport,
            filePath: path.join(reportsDir, 'StrategicReport.md')
          }]
        : dimensionReports;
        
      consolidatedReport = await generateConsolidatedReport(safeProjectName, allReportsForConsolidation);
      
      const consolidatedPath = path.join(reportsDir, 'ConsolidatedReport.md');
      await fs.writeFile(consolidatedPath, consolidatedReport, 'utf-8');
      reportPaths.push(consolidatedPath);
      console.log(`✅ Consolidated report created (including Strategic as 6th dimension)`);
      
      // PDF 생성 (안전하게)
      const pdfPath = path.join(reportsDir, 'ConsolidatedReport.pdf');
      const pdfGenerated = await generatePdfFromMarkdown(consolidatedPath, pdfPath);
      if (pdfGenerated) {
        reportPaths.push(pdfPath);
      }
      
    } catch (error) {
      console.error('❌ Failed to generate consolidated report:', error);
    }
  }

  // 8. Sources 추가
  if (visitedUrls.length > 0) {
    const sourcesContent = `# Sources\n\n${visitedUrls.map(url => `- ${url}`).join('\n')}`;
    const sourcesPath = path.join(reportsDir, 'Sources.md');
    await fs.writeFile(sourcesPath, sourcesContent, 'utf-8');
    reportPaths.push(sourcesPath);
  }

  console.log(`🎉 Comprehensive report generation completed: ${reportsDir}`);

  return {
    dimensionReports: includeDimensionReports ? dimensionReports : undefined,
    consolidatedReport,
    strategicReport,
    reportPaths
  };
}

/**
 * Dimension 파일이 없을 때의 Fallback 리포트 생성
 */
async function generateFallbackReport(
  prompt: string,
  learnings: string[],
  visitedUrls: string[],
  outputDir: string
): Promise<{
  dimensionReports?: DimensionReport[];
  consolidatedReport?: string;
  strategicReport?: string;
  reportPaths: string[];
}> {
  console.log('📝 Generating fallback comprehensive report...');

  const learningsString = learnings
    .map(learning => `<learning>\n${learning}\n</learning>`)
    .join('\n');

  const res = await generateObject({
    model: getReportModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `이전 검색에서 얻은 모든 조사 내용을 바탕으로, 주제에 대한 심층 기술 전략 보고서를 한국어로 작성하십시오.

### 리포트 구조:
1. **Executive Summary & Strategic Rationale**
2. **Market & Competitive Insights**
3. **Technology Assessment & Fit-Gap**
4. **Business Value & ROI Outlook**
5. **High-Level Roadmap (12–36 months)**
6. **Risks & Governance**

각 섹션별로 최소 4-5개의 상세한 문단을 작성하고, 구체적인 데이터와 통계를 포함해주세요.

Here is the result of All learnings. <learnings>\n${learningsString}\n</learnings>
      `
    ),
    schema: z.object({
      reportMarkdown: z.string().describe('종합적인 전략 보고서 (Markdown 형식)'),
    }),
  });

  const urlsSection = `\n\n## Sources\n\n${visitedUrls.map(url => `- ${url}`).join('\n')}`;
  const fallbackReport = res.object.reportMarkdown + urlsSection;

  const fallbackPath = path.join(outputDir, 'ComprehensiveReport.md');
  await fs.writeFile(fallbackPath, fallbackReport, 'utf-8');

  return {
    consolidatedReport: fallbackReport,
    reportPaths: [fallbackPath]
  };
}

/**
 * Deep Research 호환 인터페이스 - writeFinalReport 대체 함수
 */
export async function writeComprehensiveReport({
  prompt,
  learnings,
  visitedUrls
}: {
  prompt: string;
  learnings: string[];
  visitedUrls: string[];
}): Promise<string> {
  const result = await generateComprehensiveReport({
    prompt,
    learnings,
    visitedUrls,
    options: {
      includeDimensionReports: true,
      includeConsolidatedReport: true,
      includeStrategicReport: true
    }
  });

  // 기본적으로 Strategic Report를 반환 (가장 유용한 형태)
  return result.strategicReport || result.consolidatedReport || 'Report generation failed';
}

/**
 * CLI 실행을 위한 메인 함수
 */
async function main() {
  const projectPath = process.argv[2];
  
  if (!projectPath) {
    console.log('Usage: npx tsx comprehensive-report-generator.ts <project-path>');
    console.log('Example: npx tsx comprehensive-report-generator.ts "report/건설현장_안전관제용_시각AI기술"');
    console.log('');
    console.log('Note: This will scan existing Middle/FollowUp_* folders and generate comprehensive reports');
    return;
  }
  
  try {
    console.log(`🚀 Starting comprehensive report generation for: ${projectPath}`);
    
    const result = await generateComprehensiveReport({
      prompt: path.basename(projectPath),
      learnings: ['CLI Test Mode - Using existing project data'],
      visitedUrls: [],
      options: {
        includeDimensionReports: true,
        includeConsolidatedReport: true,
        includeStrategicReport: true,
        outputDirectory: projectPath
      }
    });
    
    console.log('\n🎉 Generation completed successfully!');
    console.log(`📁 Generated ${result.reportPaths.length} files in: ${projectPath}/ComprehensiveReports/`);
    
  } catch (error) {
    console.error('❌ Generation failed:', error);
  }
}

// CLI에서 직접 실행된 경우
if (require.main === module) {
  main().catch(console.error);
}
