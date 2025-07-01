import * as fs from 'node:fs/promises';
import * as path from 'path';
import { writeFinalReport } from './deep-research';

/**
 * 기존 연구 데이터를 읽어서 최종 보고서를 생성하는 모듈
 */

interface ReportGeneratorOptions {
  projectName: string;
  prompt?: string;
}

/**
 * 지정된 프로젝트 폴더에서 모든 MD 파일을 읽어서 학습 데이터로 변환
 */
async function collectLearningsFromProject(projectPath: string): Promise<string[]> {
  const learnings: string[] = [];
  const visitedUrls: string[] = [];

  try {
    // Middle, FollowUp_1, FollowUp_2 폴더에서 모든 MD 파일 수집
    const folders = ['Middle', 'FollowUp_1', 'FollowUp_2'];
    
    for (const folder of folders) {
      const folderPath = path.join(projectPath, folder);
      
      try {
        const files = await fs.readdir(folderPath);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`📁 ${folder} 폴더에서 ${mdFiles.length}개 파일 발견`);
        
        for (const file of mdFiles) {
          const filePath = path.join(folderPath, file);
          try {
            const content = await fs.readFile(filePath, 'utf-8');
            if (content.trim()) {
              learnings.push(content);
              console.log(`✅ ${file} 읽기 완료 (${content.length} chars)`);
            }
          } catch (error) {
            console.warn(`⚠️ ${file} 읽기 실패:`, error);
          }
        }
      } catch (error) {
        console.warn(`⚠️ ${folder} 폴더 접근 실패:`, error);
      }
    }
    
    console.log(`📊 총 ${learnings.length}개의 학습 데이터 수집 완료`);
    return learnings;
    
  } catch (error) {
    console.error('프로젝트 데이터 수집 실패:', error);
    throw error;
  }
}

/**
 * URL 목록을 수집 (실제로는 사용되지 않지만 함수 호환성을 위해)
 */
async function collectVisitedUrls(projectPath: string): Promise<string[]> {
  // 실제 URL은 수집하지 않고 빈 배열 반환
  return [];
}

/**
 * 기존 연구 데이터로부터 최종 보고서 생성
 */
export async function generateReportFromExistingData(options: ReportGeneratorOptions): Promise<string> {
  const { projectName, prompt } = options;
  
  console.log(`🚀 "${projectName}" 프로젝트의 최종 보고서 생성 시작...`);
  
  // 프로젝트 경로 설정
  const projectPath = path.join('report', projectName);
  
  // 프로젝트 폴더 존재 확인
  try {
    await fs.access(projectPath);
  } catch (error) {
    throw new Error(`프로젝트 폴더를 찾을 수 없습니다: ${projectPath}`);
  }
  
  // 기존 연구 데이터 수집
  console.log('📚 기존 연구 데이터 수집 중...');
  const learnings = await collectLearningsFromProject(projectPath);
  const visitedUrls = await collectVisitedUrls(projectPath);
  
  if (learnings.length === 0) {
    throw new Error('수집된 학습 데이터가 없습니다. Middle, FollowUp_1, FollowUp_2 폴더에 MD 파일이 있는지 확인하세요.');
  }
  
  // 프롬프트가 제공되지 않은 경우 폴더명에서 추출
  const finalPrompt = prompt || projectName.replace(/_/g, ' ');
  console.log(`📋 사용할 프롬프트: "${finalPrompt}"`);
  
  // 최종 보고서 생성
  console.log('📝 최종 보고서 생성 중...');
  const finalReport = await writeFinalReport({
    prompt: finalPrompt,
    learnings,
    visitedUrls,
  });
  
  // Final 폴더 생성 및 보고서 저장
  const finalDir = path.join(projectPath, 'Final');
  await fs.mkdir(finalDir, { recursive: true });
  
  const reportFileName = `${projectName}_report.md`;
  const reportFilePath = path.join(finalDir, reportFileName);
  
  await fs.writeFile(reportFilePath, finalReport, 'utf-8');
  
  console.log(`✅ 최종 보고서 생성 완료: ${reportFilePath}`);
  console.log(`📄 보고서 길이: ${finalReport.length} characters`);
  
  return finalReport;
}

/**
 * CLI에서 직접 실행할 수 있는 함수
 */
export async function runReportGenerator() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log(`
사용법: npm run generate-report <프로젝트명> [프롬프트]

예시:
npm run generate-report "LLM용_Graph_Rag_솔루션"
npm run generate-report "LLM용_Graph_Rag_솔루션" "LLM용 Graph RAG 솔루션"

또는 Node.js로 직접 실행:
node dist/src/report-generator.js "LLM용_Graph_Rag_솔루션"
`);
    process.exit(1);
  }
  
  const projectName = args[0];
  const prompt = args[1]; // 선택적 매개변수
  
  if (!projectName) {
    console.error('❌ 프로젝트명을 제공해야 합니다.');
    process.exit(1);
  }
  
  try {
    const report = await generateReportFromExistingData({
      projectName,
      prompt, // undefined일 수 있음 (선택적)
    });
    
    console.log('\n🎉 보고서 생성이 완료되었습니다!');
    console.log(`📁 위치: report/${projectName}/Final/${projectName}_report.md`);
    
  } catch (error) {
    console.error('❌ 보고서 생성 실패:', error);
    process.exit(1);
  }
}

// CLI에서 직접 실행된 경우
if (require.main === module) {
  runReportGenerator();
}
