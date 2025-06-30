/**
 * Dimension별 전용 리포트 생성기
 * 기존 저장된 Middle/, FollowUp_* 폴더의 파일들을 Dimension별로 그룹핑하여 전용 리포트 생성
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

// Dimension별 전용 프롬프트 템플릿
const DIMENSION_PROMPTS = {
  'Solution Overview': `
**Solution Overview 전문 리포트**

IT솔루션션 분석 전문 컨설턴트로서 솔루션 설명 리포트를 작성해주세요:


`,

  'Market Landscape & Growth Dynamics': `
**Market Landscape & Growth Dynamics 전문 리포트**

시장 분석가로서 심층 시장 리포트를 작성해주세요:

`,

  'Customer Segmentation & Demand Analysis': `
**Customer Segmentation & Demand Analysis 전문 리포트**

시장/고객 분석가로서, 심층 분석 리포트를 구조화하여 작성해주세요:


`,

  'Technology Assessment & Business Value': `
**Technology Assessment & Business Value 전문 리포트**

기술/사업 전문가로서, 기술 및 사업성 분석 리포트를 구조화하여 작성해주세요:

`,

  'Risk & Regulatory Snapshot': `
**Risk & Regulatory Snapshot 전문 리포트**

리스크/재무 분석가로서, 심층 ROI/리스크 분석 리포트를 구조화하여여 작성해주세요:

`
};

interface DimensionFile {
  filePath: string;
  content: string;
  dimension: string;
  level: string; // 'Middle', 'FollowUp_1', etc.
}

interface DimensionGroup {
  dimension: string;
  files: DimensionFile[];
  combinedContent: string;
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
          
          // 파일명에서 Dimension 추출
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
  // 확장자 제거
  const baseName = fileName.replace('.md', '');
  
  // _숫자_숫자 패턴 제거 (FollowUp 파일의 경우)
  const cleanName = baseName.replace(/_\d+_\d+$/, '');
  
  // DIMENSION_MAPPING에서 해당하는 키 찾기
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
 * 통합 리포트 생성 함수
 */
async function generateConsolidatedReport(outputDir: string, successful: any[]): Promise<void> {
  try {
    // 1. 프로젝트명 추출 (상위 디렉토리명 사용)
    const projectName = path.basename(path.dirname(outputDir));
    
    // 2. 목차 생성
    const tableOfContents = `# ${projectName} - 종합 전략 분석 리포트

## 📋 목차

${successful.map((result, index) => 
  `${index + 1}. [${result.dimension}](#${index + 1}-${result.dimension.toLowerCase().replace(/[^a-z0-9]/g, '-')})`
).join('\n')}

---

`;

    // 3. 각 Dimension 리포트 읽기 및 결합
    const reportContents = await Promise.all(
      successful.map(async (result, index) => {
        try {
          const content = await fs.readFile(result.outputPath, 'utf-8');
          
          // 섹션 번호와 함께 반환
          return `## ${index + 1}. ${result.dimension}

${content}

---
`;
        } catch (error) {
          console.warn(`Warning: Could not read ${result.outputPath}:`, error);
          return `## ${index + 1}. ${result.dimension}

*리포트 로딩 실패*

---
`;
        }
      })
    );

    // 4. 최종 통합 리포트 생성
    const consolidatedReport = tableOfContents + reportContents.join('\n');
    
    // 5. 파일 저장
    const consolidatedPath = path.join(outputDir, 'ConsolidatedReport.md');
    await fs.writeFile(consolidatedPath, consolidatedReport, 'utf-8');
    
    console.log(`📄 Consolidated report created: ${consolidatedPath}`);
    console.log(`📏 Total length: ${Math.round(consolidatedReport.length / 1000)}K characters`);
    
  } catch (error) {
    console.error('❌ Failed to create consolidated report:', error);
  }
}

/**
 * 메인 실행 함수
 */
export async function generateDimensionReports(projectPath: string): Promise<void> {
  try {
    console.log(`🔍 Scanning dimension files in: ${projectPath}`);
    
    // 1. 파일 스캔
    const files = await scanDimensionFiles(projectPath);
    console.log(`📁 Found ${files.length} dimension files`);
    
    if (files.length === 0) {
      console.log('❌ No dimension files found. Please check the project path.');
      return;
    }
    
    // 2. Dimension별 그룹핑
    const groups = groupFilesByDimension(files);
    console.log(`📊 Grouped into ${groups.length} dimensions:`);
    groups.forEach(g => console.log(`   - ${g.dimension}: ${g.files.length} files`));
    
    // 3. 출력 디렉토리 생성
    const outputDir = path.join(projectPath, 'DimensionReports');
    await fs.mkdir(outputDir, { recursive: true });
    
    // 4. 각 Dimension별 리포트 병렬 생성
    console.log('🚀 Starting parallel report generation...');
    
    const results = await Promise.all(
      groups.map(async (group) => {
        try {
          const report = await generateDimensionReport(group);
          
          // 파일명 생성 (특수문자 제거)
          const fileName = group.dimension.replace(/[^a-zA-Z0-9_\-가-힣]/g, '').replace(/\s+/g, '_') + '.md';
          const outputPath = path.join(outputDir, fileName);
          
          await fs.writeFile(outputPath, report, 'utf-8');
          console.log(`✅ Generated: ${outputPath}`);
          
          return { dimension: group.dimension, success: true, outputPath };
          
        } catch (error) {
          console.error(`❌ Failed to generate report for ${group.dimension}:`, error);
          return { dimension: group.dimension, success: false, error };
        }
      })
    );
    
    // 결과 요약
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`\n📊 Generation Summary:`);
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length}`);
      failed.forEach(f => console.log(`   - ${f.dimension}`));
    }
    
    // 5. 통합 리포트 생성 (성공한 리포트가 있는 경우만)
    if (successful.length > 0) {
      console.log('\n📋 Creating consolidated report...');
      await generateConsolidatedReport(outputDir, successful);
    }
    
    console.log(`🎉 Dimension reports generated successfully in: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error generating dimension reports:', error);
  }
}

/**
 * CLI 실행을 위한 메인 함수
 */
async function main() {
  const projectPath = process.argv[2];
  
  if (!projectPath) {
    console.log('Usage: node dimension-report-generator.js <project-path>');
    console.log('Example: node dimension-report-generator.js "report/건설현장_안전관제용_시각AI기술"');
    return;
  }
  
  await generateDimensionReports(projectPath);
}

// CLI에서 직접 실행된 경우
if (require.main === module) {
  main().catch(console.error);
}
