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
import { generateObjectSafely } from './ai/providers';


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
  'SolutionOverviewMarketAnalysis': 'Solution Overview & Market Analysis',
  'CustomerIntelligenceBusinessCase': 'Customer Intelligence & Business Case',
  'TechnologyLandscapeTrends': 'Technology Landscape & Trends',
  'CompetitiveTechnologyAnalysis': 'Competitive Technology Analysis',
  'TechnologyImplementationROI': 'Technology Implementation & ROI',
  'RiskRegulatoryAnalysis': 'Risk & Regulatory Analysis'
};

// 고정된 목차 순서
const FIXED_DIMENSION_ORDER = [
  'Solution Overview & Market Analysis',
  'Customer Intelligence & Business Case',
  'Technology Landscape & Trends', 
  'Competitive Technology Analysis',
  'Technology Implementation & ROI',
  'Risk & Regulatory Analysis'
];

// Dimension별 전용 프롬프트 템플릿
const DIMENSION_PROMPTS = {
  'Solution Overview & Market Analysis': `
**시장 기회 및 솔루션 분석 전문 리포트 작성**

다음 구조로 솔루션 및 시장 분석 리포트를 한국어로 작성하세요:

## 목차
1.1 솔루션 정의 및 핵심 가치
1.2 글로벌/한국 시장 규모 및 성장률  
1.3 주요 응용 분야 및 시장 진입 기회

## 작성 원칙
- **정보 기반 작성**: 검색 자료에서 확인된 내용만 사용
- **정보 부족 시**: [정보 부족] 또는 [추가 조사 필요]로 명시
- **핵심 내용만**: 억지로 늘이지 말고 의미 있는 내용만 포함
- **근거 제시**: 모든 수치와 주장에 출처 또는 근거 명시

## 포함할 분석 요소 (데이터 있을 때만)
- **시장 규모 요약표**: TAM/SAM/CAGR 수치 (출처와 함께)
- **지역별 시장 비교**: 글로벌 vs 한국 시장 특성
- **응용 분야 매트릭스**: 산업별 적용 가능성 및 활용사례 (존재 시)

## 작성 가이드
각 표나 데이터 제시 후 반드시 2-3개 문단으로 해석과 의미 설명 포함

`,

  'Customer Intelligence & Business Case': `
**고객 니즈 및 사업성 분석 전문 리포트 작성**

다음 구조로 고객 및 사업성 분석 리포트를 한국어로 작성하세요:

## 목차  
2.1 타겟 고객 세그먼트 및 의사결정권자
2.2 고객 Pain Point 심각도 및 현재 비용
2.3 고객 관점 ROI 및 지불 의향 분석

## 작성 원칙
- **정보 기반 작성**: 실제 사례나 설문 데이터가 있는 내용만 사용
- **정보 부족 시**: 고객 인터뷰나 시장 조사가 필요하다고 명시
- **추정 금지**: 확인되지 않은 ROI 수치나 지불 의향 추측 금지
- **근거 제시**: 모든 고객 데이터에 출처나 조사 방법 명시

## 포함할 분석 요소 (데이터 있을 때만)
- **고객 세그먼트 매트릭스**: 산업/규모별 분류와 특성
- **Pain Point 심각도 매트릭스**: 빈도×비용 기준 우선순위
- **ROI 시나리오 테이블**: 고객 유형별 투자 회수 기간

## 작성 가이드
각 표나 매트릭스 제시 후 반드시 고객 관점에서의 해석과 시사점 설명


`,

  'Technology Landscape & Trends': `
**기술 동향 및 혁신 기회 전문 리포트 작성**

다음 구조로 기술 환경 분석 리포트를 한국어로 작성하세요:

## 목차
3.1 2024-2025 핵심 기술 트렌드
3.2 기술 스택 및 아키텍처 옵션
3.3 기술 성숙도 및 표준화 현황

## 작성 원칙
- **사실 기반 작성**: 기술 보고서나 컨퍼런스 발표 등 확인된 정보만 사용
- **과장 금지**: "혁신적", "획기적" 등 주관적 수식어 사용 금지
- **현실적 평가**: 기술의 한계와 성숙도를 객관적으로 평가
- **근거 제시**: 기술 동향에 대한 출처나 전문가 의견 명시

## 포함할 분석 요소 (정보 있을 때만)
- **기술 성숙도 곡선**: 각 기술의 발전 단계와 상용화 시점
- **기술 스택 다이어그램**: 구성 요소별 기술 옵션과 의존성
- **표준화 진행 상황 요약**: 주요 표준 기구의 진행 현황

## 작성 가이드
각 다이어그램이나 평가 후 반드시 기술적 시사점과 도입 고려사항 설명

`,

  'Competitive Technology Analysis': `
**경쟁 환경 및 차별화 전략 전문 리포트 작성**

다음 구조로 경쟁 분석 리포트를 한국어로 작성하세요:

## 목차
4.1 주요 경쟁사 기술 수준 및 시장 점유율
4.2 경쟁사별 강약점 및 전략 분석
4.3 차별화 포인트 및 경쟁 우위 확보 방안

## 작성 원칙
- **공개 정보 기반**: 경쟁사 공식 발표나 공개된 스펙만 사용
- **추측 금지**: 확인되지 않은 경쟁사 전략이나 계획 추측 금지
- **객관적 평가**: 우리 편향 없이 경쟁사 강점도 인정하며 분석
- **근거 제시**: 시장 점유율이나 기술 수준 평가의 출처 명시

## 포함할 분석 요소 (데이터 있을 때만)
- **경쟁사 포지셔닝 맵**: 기술력 vs 시장 점유율 기준 매핑
- **기능별 경쟁 비교표**: 주요 기능과 성능의 객관적 비교
- **차별화 기회 매트릭스**: 시장 갭과 기술 역량 교차 분석

## 작성 가이드
각 비교표나 포지셔닝 후 반드시 전략적 의미와 대응 방향 해석
`,

  'Technology Implementation & ROI': `
**구현 계획 및 투자 수익성 전문 리포트 작성**

다음 구조로 기술 구현 및 사업성 리포트를 한국어로 작성하세요:

## 목차
5.1 검증된 구현 방법론 및 베스트 프랙티스
5.2 개발 과정의 주요 과제 및 해결 방안
5.3 투자 비용 대비 수익성 및 회수 기간

## 작성 원칙
- **실증 기반 작성**: 실제 구현 사례나 공개된 ROI 데이터만 사용
- **추정치 명시**: 불확실한 비용이나 수익은 "추정" 또는 "예상" 표기
- **현실적 평가**: 과도하게 낙관적인 ROI 시나리오 지양
- **근거 제시**: 비용 산정이나 수익 예측의 계산 방법과 가정 명시

## 포함할 분석 요소 (데이터 있을 때만)
- **투자 회수 시나리오 테이블**: 보수적/중간/낙관적 시나리오별 분석
- **구현 단계별 프로세스 차트**: 단계별 기간과 필요 리소스
- **비용 구성 요소 분석**: 개발비, 운영비, 인력비 등 세부 항목

## 작성 가이드
각 시나리오나 차트 제시 후 반드시 전제 조건과 리스크 요인 설명
`,

'Risk & Regulatory Analysis': `
**리스크 관리 및 규제 대응 전문 리포트 작성**

다음 구조로 리스크 및 규제 분석 리포트를 한국어로 작성하세요:

## 목차
6.1 기술 구현 리스크 및 완화 방안
6.2 규제 요구사항 및 컴플라이언스 대응
6.3 시장 진입 장벽 및 극복 전략

## 작성 원칙
- **사실 기반 위험 평가**: 실제 발생한 사례나 보고된 이슈만 인용
- **과도한 우려 금지**: 근거 없는 리스크 부풀리기 지양
- **현실적 대응**: 실현 가능한 완화 방안만 제시
- **근거 제시**: 규제 내용이나 리스크 평가의 출처와 시점 명시

## 포함할 분석 요소 (정보 있을 때만)
- **리스크-영향도 매트릭스**: 발생 확률과 영향도 기준 우선순위
- **규제 타임라인**: 현행 및 예정 규제의 시행 일정
- **완화 전략 로드맵**: 리스크별 대응 계획과 일정

## 작성 가이드
각 매트릭스나 타임라인 후 반드시 리스크 관리 관점에서의 해석과 권고사항 설명
`,

};

// 전략적 리포트 프롬프트
const STRATEGIC_PROMPT = `
**전략적 권고 및 실행 계획 전문 리포트 작성**

다음 구조로 전략 권고 리포트를 한국어로 작성하세요:

## 목차
7.1 기술 후보군 발굴 및 초기 평가
7.2 개발기술 선정 기준 및 비교 분석
7.3 최종 선정 기술 및 실행 전략
7.4 성과 지표 및 중간 점검 체계

## 작성 원칙
- **종합 분석 기반**: 앞선 6개 파트 내용을 종합하여 논리적 결론 도출
- **단계적 의사결정**: 후보 발굴 → 기준 수립 → 비교 평가 → 최종 선정 순서
- **현실적 권고**: 당사 규모와 역량을 고려한 실행 가능한 계획만 제시
- **측정 가능성**: 추상적 목표가 아닌 구체적이고 측정 가능한 지표 제시

## 당사 현황 반영 (필수)
- 매출 5,000억원, 영업이익 200억원 중견 IT/SI기업
- 연간 20억원 AI 투자 예산 활용 방안
- 기존 IT/SI 역량과 고객 기반 활용 전략

## 포함할 분석 요소 (체계적 선정 과정)
- **기술 후보군 매트릭스**: 5-7개 후보 기술의 특징과 적용 가능성
- **선정 기준 가중치 테이블**: 시장성, 기술성, 수익성, 실현가능성 등 기준별 가중치
- **기술 평가 스코어카드**: 후보별 기준 적용 점수와 종합 순위
- **최종 실행 로드맵**: 선정된 2-3개 기술의 3년 단위 개발 일정

## 세부 작성 가이드

### 7.1 기술 후보군 발굴 및 초기 평가
- 앞선 분석에서 도출된 5-7개 기술 후보 정리
- 각 기술별 핵심 특징, 기술 성숙도, 시장 적용 가능성 요약
- 후보군 매트릭스로 정리 후 각 기술의 잠재력과 한계 설명

### 7.2 개발기술 선정 기준 및 비교 분석  
- 선정 기준 설정: 시장 매력도, 기술 실현가능성, 수익성, 당사 역량 적합성 등
- 기준별 가중치 설정 및 근거 설명
- 후보 기술별 기준 적용하여 정량적 평가 수행
- 평가 결과를 스코어카드나 매트릭스로 시각화

### 7.3 최종 선정 기술 및 실행 전략
- 평가 결과 기반 상위 2-3개 기술 최종 선정
- 선정 기술별 개발 우선순위와 투자 배분 전략
- 단계별 개발 로드맵과 마일스톤 설정
- 팀 구성, 파트너십, 예산 배분 계획

### 7.4 성과 지표 및 중간 점검 체계
- 단계별 성공 지표(KPI) 설정
- 정기 리뷰 체계 및 전략 수정 기준점
- 리스크 모니터링 및 대응 체계

## 작성 가이드
각 평가나 계획 후 반드시 의사결정 근거와 대안 시나리오 설명
 
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

// 새로 추가할 인터페이스들
interface SourceInfo {
  originalId: number;
  newId: number;
  url: string;
  title?: string;
  fileName: string;
}

interface ProcessedFileContent {
  content: string;
  sources: SourceInfo[];
}

interface DimensionGroupWithSources extends DimensionGroup {
  combinedContentWithRenumberedSources: string;
  allSources: SourceInfo[];
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

function processFileWithSourceRenumbering(
  fileContent: string,
  fileName: string,
  startingNumber: number
): ProcessedFileContent {
  
  console.log(`🔄 Processing ${fileName}, starting from [${startingNumber}]`);
  
  // Sources 섹션 분리
  const sourcesPatterns = [
    /---\s*\n\s*\*?\*?Sources?\*?\*?:?\s*\n/i,
    /\n\s*\*?\*?Sources?\*?\*?:?\s*\n/i,
    /\n\s*##\s*Sources?\s*\n/i
  ];
  
  let parts: string[] = [];
  let sourcesSection = '';
  let mainContent = fileContent;
  
  for (const pattern of sourcesPatterns) {
    parts = fileContent.split(pattern);
    if (parts.length > 1) {
      mainContent = parts[0] || '';
      sourcesSection = parts[1] || '';
      break;
    }
  }
  

  // Sources 섹션에서 소스 정보 추출
  const sourceMap = new Map<number, { url: string; title?: string }>();

  if (sourcesSection) {
    const sourceLines = sourcesSection.split('\n').filter(line => line.trim());
    
    sourceLines.forEach(line => {
      const patterns = [
        /(\d+)\.\s*(.+?)(?:\s*-\s*(https?:\/\/[^\s]+))?\s*$/,
        /(\d+)\.\s*(https?:\/\/[^\s]+)\s*(?:-\s*(.+?))?\s*$/,
        /(\d+)\.\s*\[([^\]]+)\]\s*-\s*(https?:\/\/[^\s]+)/,
        /(\d+)\.\s*(.+)/
      ];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match && match.length > 1 && match[1]) { // ✅ 더 안전한 체크
          const originalId = parseInt(match[1]);
          let title: string | undefined;
          let url: string = '';
          
          // match[2], match[3] 안전하게 접근
          const secondGroup = match[2] || '';
          const thirdGroup = match[3] || '';
          
          if (thirdGroup && thirdGroup.startsWith('http')) {
            title = secondGroup.trim() || undefined;
            url = thirdGroup;
          } else if (secondGroup && secondGroup.startsWith('http')) {
            url = secondGroup;
            title = thirdGroup.trim() || undefined;
          } else {
            title = secondGroup.trim() || undefined;
            url = (title && title.startsWith('http')) ? title : '';
          }
          
          if (url) {
            sourceMap.set(originalId, { url, title });
          }
          break;
        }
      }
    });
  }

  // 본문에서 사용된 인용 번호 찾기 및 매핑
  const citationPattern = /\[(\d+)\]/g;
  const usedSources = new Set<number>();
  const sourceMapping = new Map<number, number>();
  let currentNewNumber = startingNumber;
  
  let match: RegExpExecArray | null;
  while ((match = citationPattern.exec(mainContent)) !== null) {
    if (match && match.length > 1 && match[1]) {
      const originalId = parseInt(match[1]);
      usedSources.add(originalId);
    }
  }
  
  // ✅ finalSources를 여기서 선언 (루프 밖에서)
  const sortedUsedSources = Array.from(usedSources).sort((a, b) => a - b);
  const finalSources: SourceInfo[] = [];
  
  sortedUsedSources.forEach(originalId => {
    const sourceInfo = sourceMap.get(originalId);
    if (sourceInfo) {
      sourceMapping.set(originalId, currentNewNumber);
      finalSources.push({
        originalId,
        newId: currentNewNumber,
        url: sourceInfo.url,
        title: sourceInfo.title,
        fileName
      });
      currentNewNumber++;
    }
  });
  
  // 본문의 인용 번호를 새 번호로 교체
  let processedContent = mainContent;
  sourceMapping.forEach((newId, originalId) => {
    const originalPattern = new RegExp(`\\[${originalId}\\]`, 'g');
    processedContent = processedContent.replace(originalPattern, `[${newId}]`);
  });
  
  return {
    content: processedContent.trim(),
    sources: finalSources  // ✅ 이제 에러 없음
  };
}

/**
 * Dimension별로 파일 그룹핑
 */
function groupFilesByDimension(files: DimensionFile[]): DimensionGroupWithSources[] {
  const groups = new Map<string, DimensionFile[]>();
  
  // 1. 기본 그룹핑
  for (const file of files) {
    if (!groups.has(file.dimension)) {
      groups.set(file.dimension, []);
    }
    groups.get(file.dimension)!.push(file);
  }
  
  // 2. 각 그룹별로 소스 재정렬하여 결합
  return Array.from(groups.entries()).map(([dimension, files]) => {
    console.log(`\n📊 Processing dimension: "${dimension}" (${files.length} files)`);
    
    let combinedContent = '';
    let combinedContentWithRenumberedSources = '';
    const allSources: SourceInfo[] = [];
    let currentStartingNumber = 1;
    
    files.forEach((file, index) => {
      const fileName = path.basename(file.filePath, '.md');
      
      // 🔥 소스 재정렬 처리
      const processed = processFileWithSourceRenumbering(
        file.content,
        fileName,
        currentStartingNumber
      );
      
      // 파일 구분자 추가 (첫 번째 파일 제외)
      if (index > 0) {
        combinedContent += '\n\n---\n\n';
        combinedContentWithRenumberedSources += '\n\n---\n\n';
      }
      
      combinedContent += file.content; // 기존 방식 (호환성)
      combinedContentWithRenumberedSources += processed.content; // 재정렬된 방식
      allSources.push(...processed.sources);
      
      // 다음 파일의 시작 번호 업데이트
      currentStartingNumber += processed.sources.length;
    });
    
    console.log(`   ✅ "${dimension}": ${allSources.length} total sources`);
    
    return {
      dimension,
      files,
      combinedContent, // 기존 호환성 유지
      combinedContentWithRenumberedSources, // 새로운 재정렬된 버전
      allSources
    };
  });
}

/**
 * Dimension별 전용 리포트 생성
 */
async function generateDimensionReport(group: DimensionGroupWithSources): Promise<string> {
  const prompt = DIMENSION_PROMPTS[group.dimension as keyof typeof DIMENSION_PROMPTS];
  
  if (!prompt) {
    throw new Error(`${group.dimension}에 대한 프롬프트가 정의되지 않았습니다.`);
  }
  
  console.log(`📊 Generating ${group.dimension} report...`);
  console.log(`   📎 Using ${group.allSources.length} renumbered sources`);
  
  const res = await generateObjectSafely({
    model: getReportModel(),
    system: systemPrompt(),
    prompt: trimPrompt(
      `${prompt}

**연구 자료:**
다음은 "${group.dimension}" 관련하여 수집된 연구 자료입니다.
소스 번호는 이미 [1]부터 [${group.allSources.length}]까지 순차적으로 정렬되어 있습니다.

<research_content>
${group.combinedContentWithRenumberedSources}
</research_content>

**보고서 대상:**
이 보고서는 해당 기술/시장에 대한 전문지식이 제한적인 경영진과 의사결정자들을 주요 독자로 합니다.
전문성을 유지하면서도 비전문가가 이해할 수 있도록 한국어로 작성해주세요.

**핵심 작성 원칙:**
1. 제공된 연구 자료에 명시된 정보만 사용
2. 전문용어 사용 시 반드시 간단한 설명 병기
3. 모든 정보에 [번호] 출처 표기
4. 인용할 때는 제공된 [1]~[${group.allSources.length}] 번호를 그대로 사용

## 공통 작성 가이드라인 (환각 방지 중요)
- **정보 없으면 솔직히 표기**: [정보 부족], [추가 조사 필요], [데이터 미확인] 사용
- **근거 없는 주장 금지**: "~할 것으로 예상됨", "~가 유리할 것임" 등 추측성 표현 금지
- **과장 금지**: "혁신적", "획기적", "압도적" 등 주관적 수식어 사용 금지
- **출처 명시**: 구체적 수치나 주장에는 반드시 출처 또는 조사 기관 명시
- **현실적 평가**: 장점과 단점을 균형 있게 제시하며 과도한 낙관론 지양

## 표/차트 사용 원칙
- **데이터 있을 때만**: 충분한 정보가 없으면 표 대신 텍스트로 설명
- **설명 필수**: 모든 표/차트 후에는 2-3개 문단의 해석과 시사점 포함
- **출처 표기**: 표 하단에 데이터 출처와 조사 시점 명시
- **전체 표화 금지**: 보고서 전체를 표로만 구성하지 말고 줄글과 균형 유지

## 금지 사항 (환각 방지)
- 확인되지 않은 시장 예측이나 기업 전략 추측
- 과도하게 구체적인 수치 (ex: "정확히 23.7% 성장 예상")
- 근거 없는 우위 주장 (ex: "우리가 확실히 이길 수 있음")
- 내용 늘리기 위한 반복적이거나 추상적 서술
- 검색 결과에 없는 내용을 상식으로 보완하여 작성
`
    ),
    schema: z.object({
      report: z.string().describe('Dimension에 특화된 상세한 전문 리포트 (Markdown 형식)'),
    }),
  });
  
  // 소스 섹션 추가
  let sourcesSection = '\n\n---\n\n## Sources\n\n';
  group.allSources.forEach(source => {
    if (source.title && source.title !== source.url) {
      sourcesSection += `${source.newId}. ${source.title} - ${source.url}\n`;
    } else {
      sourcesSection += `${source.newId}. ${source.url}\n`;
    }
  });
  
  const reportWithSources = res.report + sourcesSection;
  
  console.log(`   ✅ Generated report with ${group.allSources.length} properly numbered sources`);
  
  return reportWithSources;
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

  const res = await generateObjectSafely({
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
      report: z.string().describe('전략적으로 재구성된 Executive Report (Markdown 형식)'),
    }),
  });
  
  return res.report;
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

  const res = await generateObjectSafely({
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
  const fallbackReport = res.report + urlsSection; //res.object.reportMarkdown + urlsSection; 

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
