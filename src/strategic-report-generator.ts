/**
 * 전략적 리포트 재구성 생성기
 * 5개 Dimension 리포트를 읽어서 AI가 전략적으로 재구성한 Executive Report 생성
 */

import { generateObject } from 'ai';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { getReportModel, trimPrompt } from './ai/providers';
import { systemPrompt } from './prompt';

// Dimension 매핑 테이블
const DIMENSION_MAPPING = {
  'SolutionOverview': 'Solution Overview',
  'MarketLandscapeGrowthDynamics': 'Market Landscape & Growth Dynamics',
  'CustomerSegmentationDemandAnalysis': 'Customer Segmentation & Demand Analysis',
  'TechnologyAssessmentBusinessValue': 'Technology Assessment & Business Value',
  'RiskRegulatorySnapshot': 'Risk & Regulatory Snapshot'
};

interface DimensionContent {
  dimension: string;
  content: string;
  filePath: string;
}

/**
 * DimensionReports 폴더에서 모든 개별 리포트 스캔
 */
async function scanDimensionReports(dimensionReportsDir: string): Promise<DimensionContent[]> {
  const dimensionContents: DimensionContent[] = [];
  
  try {
    const files = await fs.readdir(dimensionReportsDir);
    
    for (const fileName of files) {
      if (fileName.endsWith('.md') && fileName !== 'ConsolidatedReport.md' && fileName !== 'StrategicReport.md') {
        const filePath = path.join(dimensionReportsDir, fileName);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 파일명에서 Dimension 추출
        const dimension = extractDimensionFromFileName(fileName);
        if (dimension) {
          dimensionContents.push({
            dimension,
            content,
            filePath
          });
        }
      }
    }
    
    return dimensionContents;
  } catch (error) {
    console.error('Error scanning dimension reports:', error);
    return [];
  }
}

/**
 * 파일명에서 Dimension 추출
 */
function extractDimensionFromFileName(fileName: string): string | null {
  const baseName = fileName.replace('.md', '');
  
  for (const [key, value] of Object.entries(DIMENSION_MAPPING)) {
    if (baseName === key) {
      return value;
    }
  }
  
  return null;
}

/**
 * AI를 이용한 전략적 리포트 재구성
 */
async function generateStrategicReport(
  projectName: string, 
  dimensionContents: DimensionContent[]
): Promise<string> {
  
  console.log('🧠 AI가 전략적 재구성을 시작합니다...');
  
  // 모든 Dimension 내용을 하나의 컨텍스트로 결합
  const allContent = dimensionContents.map(dc => 
    `## ${dc.dimension}\n\n${dc.content}`
  ).join('\n\n---\n\n');

  const strategicPrompt = `
당신은 전략 컨설팅 전문가입니다.

나는 특정 IT/AI기술과 관련된 조사내용 5개의 Dimension 개별보고서를 제공합니다.

당신의 주 역할은 **6번째 보고서 부분인, 기술전략략 Dimension 파트 보고서를 작성하는 것""입니다.
(필요 인력, 필요 예산, 3년 마일스톤)
사업적인 관점에서 어떤 전략을 취해야 하는지에 대해 아래 당사 현황을 바탕으로 보고서를 작성해주세요.

- 당사 현황 - 
우리 기업은 매출 5,000억 영업이익 200억 원 수준의 
중견 IT/SI기업이며, 연간 약 20억을 투자하여 AI 사업진출을 검토 중입니다. 
 
당신이 담당하는 6 Dimension의 각 섹션은 경영진이 의사결정할 수 있는 수준의 구체적 정보를 포함해야 합니다.
`;

  const res = await generateObject({
    model: getReportModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `${strategicPrompt}

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
 * 메인 실행 함수
 */
export async function generateStrategicReports(projectPath: string): Promise<void> {
  try {
    console.log(`🎯 Starting strategic report generation for: ${projectPath}`);
    
    // 1. DimensionReports 디렉토리 확인
    const dimensionReportsDir = path.join(projectPath, 'DimensionReports');
    const dirExists = await fs.access(dimensionReportsDir).then(() => true).catch(() => false);
    
    if (!dirExists) {
      console.log('❌ DimensionReports directory not found. Please run dimension-report-generator first.');
      return;
    }
    
    // 2. 개별 Dimension 리포트 스캔
    const dimensionContents = await scanDimensionReports(dimensionReportsDir);
    console.log(`📁 Found ${dimensionContents.length} dimension reports:`);
    dimensionContents.forEach(dc => console.log(`   - ${dc.dimension}`));
    
    if (dimensionContents.length === 0) {
      console.log('❌ No dimension reports found. Please generate dimension reports first.');
      return;
    }
    
    // 3. 프로젝트명 추출
    const projectName = path.basename(projectPath);
    console.log(`🏗️ Project: ${projectName}`);
    
    // 4. AI를 이용한 전략적 리포트 생성
    try {
      const strategicReport = await generateStrategicReport(projectName, dimensionContents);
      
      // 5. 파일 저장
      const strategicReportPath = path.join(dimensionReportsDir, 'StrategicReport.md');
      await fs.writeFile(strategicReportPath, strategicReport, 'utf-8');
      
      console.log(`✅ Strategic report generated: ${strategicReportPath}`);
      console.log(`📏 Report length: ${Math.round(strategicReport.length / 1000)}K characters`);
      
    } catch (error) {
      console.error('❌ Failed to generate strategic report:', error);
    }
    
  } catch (error) {
    console.error('❌ Error in strategic report generation:', error);
  }
}

/**
 * CLI 실행을 위한 메인 함수
 */
async function main() {
  const projectPath = process.argv[2];
  
  if (!projectPath) {
    console.log('Usage: npx tsx strategic-report-generator.ts <project-path>');
    console.log('Example: npx tsx strategic-report-generator.ts "report/건설현장_안전관제용_시각AI기술"');
    console.log('');
    console.log('Note: This requires existing dimension reports in <project-path>/DimensionReports/');
    return;
  }
  
  await generateStrategicReports(projectPath);
}

// CLI에서 직접 실행된 경우
if (require.main === module) {
  main().catch(console.error);
}
