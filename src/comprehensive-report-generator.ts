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

**목표:** 솔루션의 본질과 시장에서의 위치를 비전문가도 이해할 수 있게 설명

**1.1 Solution Architecture & Core Capabilities**
이 섹션에서는 해당 솔루션이 무엇을 하는 기술인지, 어떻게 작동하는지를 설명해주세요.

작성 가이드:
- 첫 번째 문단: 솔루션의 핵심 기능을 일반인도 이해할 수 있는 비유나 예시로 설명
- 두 번째 문단: 주요 기술적 구성요소를 설명하되, 각 요소가 왜 필요한지 맥락 제공
- 세 번째 문단: 기존 방식과의 차이점과 그로 인한 장점

예시 서술 방식:
"[솔루션명]은 ___을 위한 전문 기술입니다. 이는 마치 ___와 같아서, 기존의 ___방식과 달리 ___한 방법으로 ___문제를 해결합니다. 핵심 구성요소로는 ___이 있으며, 이를 통해 ___한 성능 향상을 달성할 수 있습니다[출처]."

**1.2 Competitive Landscape & Market Positioning**
시장에서 경쟁사들과 어떻게 다른지, 경쟁 구도가 어떤지 설명해주세요.

작성 가이드:
- 첫 번째 문단: 주요 경쟁사나 대안 솔루션들 소개 (연구 자료에 있는 경우만)
- 두 번째 문단: 경쟁사 대비 차별화 포인트나 장단점 비교
- 세 번째 문단: 시장에서의 포지션이나 점유율 관련 정보

**1.3 Value Proposition & Unmet Needs Analysis**
고객이 왜 이 솔루션을 필요로 하는지, 어떤 문제를 해결해주는지 설명해주세요.

작성 가이드:
- 첫 번째 문단: 현재 고객들이 겪고 있는 주요 문제점들
- 두 번째 문단: 이 솔루션이 어떻게 그 문제들을 해결하는지
- 세 번째 문단: 해결했을 때의 구체적 효과나 이익 (정량적 데이터 포함)

**1.4 Go-to-Market Strategy & Positioning**
어떻게 시장에 진출하고 고객에게 접근하는지에 대한 정보를 정리해주세요.

작성 가이드:
- 연구 자료에 시장 진입 전략이 언급된 경우만 작성
- 실제 사례나 계획이 명시된 경우에만 포함
- 추측이나 일반론 배제 

`,

  'Market Landscape & Growth Dynamics': `
**Market Landscape & Growth Dynamics 파트 리포트**

**목표:** 시장의 크기와 성장성을 구체적 수치와 함께 설명

**2.1 Global TAM/SAM Analysis with CAGR Projections**
글로벌 시장 규모와 성장률에 대한 정보를 정리해주세요.

작성 가이드:
- 첫 번째 문단: 전체 시장 규모를 구체적 수치로 제시하고, 그 규모가 어느 정도인지 비교 설명
- 두 번째 문단: 연평균 성장률(CAGR)과 그 의미 설명
- 세 번째 문단: 지역별 차이가 있다면 해당 내용 포함

예시 서술:
"글로벌 ___시장은 2024년 기준 약 ___억 달러 규모로 추정됩니다[출처]. 이는 ___산업 전체 시장의 약 ___%에 해당하는 크기입니다. 향후 ___년간 연평균 ___%의 성장률을 보일 것으로 예상되어, 2030년에는 ___억 달러 규모로 확대될 전망입니다[출처]."

**2.2 Regional Market Sizing & Opportunities**
지역별(특히 한국) 시장 현황을 정리해주세요.

**2.3 Industry Value Chain & Ecosystem Mapping**
산업 구조와 주요 참여자들에 대한 정보를 정리해주세요.

**2.4 Investment Trends & M&A Activities**
투자와 인수합병 동향을 구체적 사례와 함께 정리해주세요.

`,

  'Customer Segmentation & Demand Analysis': `
**Customer Segmentation & Demand Analysis 파트 리포트**

**목표:** 고객이 누구인지, 무엇을 원하는지를 구체적으로 설명

**3.1 Target Customer Segmentation (B2B Focus)**
주요 고객층이 누구인지 분류하고 설명해주세요.

작성 가이드:
- 첫 번째 문단: 주요 고객 세그먼트를 업종, 규모, 특성별로 분류
- 두 번째 문단: 각 세그먼트의 특징과 규모 (정량적 데이터 포함)
- 세 번째 문단: 세그먼트별 접근 방법이나 특이사항

**3.2 Pain Point Severity & Jobs-to-be-Done Analysis**
고객들이 어떤 문제를 겪고 있는지 구체적으로 설명해주세요.

작성 가이드:
- 문제의 심각성을 정량적으로 표현 (비용, 시간, 빈도 등)
- 현재 해결방안의 한계점 명시
- 문제 해결의 시급성이나 우선순위 설명

**3.3 Demand Quantification & Willingness-to-Pay**
시장 수요의 크기와 고객의 지불 의향을 설명해주세요.

**3.4 Customer Acquisition & Retention Strategy**
고객 확보와 유지 방법에 대한 정보를 정리해주세요.

`,

  'Technology Assessment & Business Value': `
**Technology Assessment & Business Value 파트 리포트**

**목표:** 기술의 실현 가능성과 비즈니스 가치를 평가

**4.1 Core vs Emerging Technology Stack Analysis**
핵심 기술과 신기술을 비교 분석해주세요.

작성 가이드:
- 첫 번째 문단: 현재 주로 사용되는 기술들과 그 특징
- 두 번째 문단: 새롭게 등장하는 기술들과 기존 기술 대비 장점
- 세 번째 문단: 기술별 성숙도나 안정성 평가

예시 서술:
"현재 ___분야에서는 주로 ___기술이 사용되고 있습니다. 이 기술은 ___한 장점이 있지만, ___한 한계가 있어 ___문제가 발생합니다[출처]. 반면 새롭게 주목받는 ___기술은 ___방식을 통해 이러한 문제를 해결할 수 있으며, 실제로 ___한 성능 개선을 보여주고 있습니다[출처]."

**4.2 Implementation Complexity & Resource Requirements**
구현 난이도와 필요한 자원을 설명해주세요.

**4.3 Business Value & ROI Projections by Use Case**
활용 사례별 비즈니스 가치를 구체적으로 설명해주세요.

**4.4 Technology Roadmap & Evolution Path**
기술 발전 방향과 로드맵을 설명해주세요.
`,

  'Risk & Regulatory Snapshot': `
**Risk & Regulatory Snapshot 파트 리포트**

**목표:** 예상되는 리스크와 규제 환경을 객관적으로 평가

**5.1 Technology & Operational Risks**
기술적, 운영적 리스크 요인들을 설명해주세요.

작성 가이드:
- 실제 발생한 사례나 보고된 문제점 중심으로 서술
- 리스크의 발생 가능성이나 영향도가 언급된 경우 포함
- 추측성 리스크는 배제하고 확인된 사안만 다룸

**5.2 Market Entry Barriers & Competitive Threats**
시장 진입 장벽과 경쟁 위협을 분석해주세요.

**5.3 Regulatory & Compliance Requirements**
관련 규제와 컴플라이언스 요구사항을 정리해주세요.

**5.4 Risk Mitigation & Contingency Planning**
리스크 완화 방안에 대한 정보를 정리해주세요.
`
};

// 전략적 리포트 프롬프트
const STRATEGIC_PROMPT = `
**목표:** 앞서 분석한 5개 Dimension을 종합하여 구체적이고 실행 가능한 기술 개발 전략 수립

**6.1 Technology Candidate Assessment**
앞서 분석된 기술들 중에서 개발 후보를 체계적으로 평가해주세요.

작성 가이드:
- 첫 번째 문단: 앞선 분석에서 언급된 핵심 기술들을 정리 (5-7개 내외)
- 두 번째 문단: 각 기술의 핵심 특징과 적용 분야를 간략히 설명
- 세 번째 문단: 기술별 현재 성숙도와 시장 접근 가능성 개괄

예시 서술:
"앞선 분석을 종합하면, 현재 ___분야에서 주요 개발 후보 기술로는 ①___, ②___, ③___, ④___ 등이 있습니다. ___기술은 ___한 장점으로 ___시장에서 활용 가능하며, ___기술은 ___한 차별화 요소를 가지고 있습니다[관련 Dimension 참조]. 이들 기술의 성숙도를 살펴보면, ___기술은 상용화 단계에 근접해 있고, ___기술은 아직 연구개발 초기 단계에 있는 상황입니다."

**6.2 Selection Criteria & Evaluation Framework**
기술 선정을 위한 명확한 기준을 설정해주세요.

작성 가이드:
- 첫 번째 문단: 시장 관련 기준 (시장 규모, 성장성, 경쟁 강도 등)
- 두 번째 문단: 기술 관련 기준 (개발 난이도, 기술 성숙도, 차별화 가능성 등)
- 세 번째 문단: 비즈니스 관련 기준 (투자 대비 수익성, 기존 역량 활용도, 리스크 수준 등)

예시 기준 제시:
"기술 선정을 위해 다음 3개 영역의 기준을 적용합니다. 
【시장 매력도】 목표 시장 규모가 ___억원 이상이고, 연평균 성장률이 ___%를 넘는 분야를 우선 고려합니다[Market Dimension 분석 근거]. 
【기술 실현성】 당사의 현재 기술 역량으로 3년 내 상용화가 가능하고, 20억원 투자 범위 내에서 개발 가능한 기술을 선별합니다[Technology Dimension 분석 근거]. 
【사업 적합성】 기존 SI 사업과 시너지가 있고, 예상 ROI가 ___%를 초과하는 기술에 집중합니다[Customer & Risk Dimension 분석 근거]."

**6.3 Final Technology Selection (Top 3)**
선정 기준에 따라 최종 3개 기술을 선택하고 그 이유를 설명해주세요.

작성 가이드:
- 각 선정 기술당 하나의 문단으로 구성
- 선정 이유를 앞서 설정한 기준에 따라 객관적으로 제시
- 각 기술의 예상 개발 기간과 투자 규모 명시

예시 구성:
"【1순위: ___기술】 이 기술은 ___억원 규모의 시장을 목표로 하며, 연간 ___%의 높은 성장률을 보이고 있습니다[시장 근거]. 당사가 보유한 ___역량을 활용하면 약 __개월 내 프로토타입 개발이 가능하고, 총 __억원의 투자로 상용화할 수 있을 것으로 판단됩니다[기술 근거]. 또한 기존 ___고객층에게 직접 판매할 수 있어 초기 시장 진입이 용이합니다[고객 근거]."

**6.4 3-Year Development Roadmap & Milestones**
선정된 3개 기술의 단계별 개발 계획을 수립해주세요.

작성 가이드:
- 첫 번째 문단: 전체 로드맵 개요와 단계별 목표 설정
- 두 번째 문단: 1년차 계획 (연구개발 및 프로토타입 단계)
- 세 번째 문단: 2년차 계획 (파일럿 테스트 및 상용화 준비)
- 네 번째 문단: 3년차 계획 (본격 상용화 및 시장 확대)

마일스톤 예시:
"3년간의 기술 개발은 다음과 같이 단계별로 진행됩니다. 
【1년차 (연구개발 집중)】 선정된 3개 기술의 핵심 알고리즘 개발과 기초 검증을 완료합니다. ___기술은 __월까지 프로토타입을, ___기술은 __월까지 POC(Proof of Concept)를 완성할 계획입니다. 이 단계에서 총 __억원을 투자하여 ___명의 개발 인력을 확보합니다.
【2년차 (검증 및 개선)】 고객사와의 파일럿 프로젝트를 통해 실제 환경에서의 성능을 검증하고 상용화 수준까지 개선합니다. 목표는 ___기술의 경우 ___고객, ___기술의 경우 ___고객과의 파일럿을 성공적으로 완료하는 것입니다.
【3년차 (상용화 및 확산)】 본격적인 시장 출시와 매출 창출을 시작합니다. 3년차 말까지 ___기술에서 __억원, ___기술에서 __억원의 매출 달성을 목표로 합니다."

작성 시 주의사항:
- 앞선 5개 Dimension 분석 결과를 반드시 근거로 활용
- 구체적 수치나 일정은 앞선 분석에서 언급된 정보만 사용
- 추측이나 임의의 계획보다는 분석 결과에 기반한 합리적 추론
- 리스크 요인도 함께 언급하여 현실성 확보
- 전문적이고 심층적인 분석을 제공해주세요. 
- Source는 적지마세요.
 
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
3. 데이터와 수치는 의미와 맥락을 함께 제시
4. 추론이나 추측 없이 사실 중심으로 서술
5. 정보 부족 시 "관련 정보 부족" 명시
6. 모든 정보에 [번호] 출처 표기
7. 인용할 때는 제공된 [1]~[${group.allSources.length}] 번호를 그대로 사용

**문체 및 구조 가이드:**
- 각 하위 섹션을 2-3개의 완성된 문단으로 구성
- 문단당 4-6문장, 150-250단어 내외
- 첫 문장에 핵심 메시지 명시
- bullet point보다 서술형 문단 우선
- 논리적 흐름: 배경/현황 → 문제/기회 → 해결방안/대안 → 효과/의미

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
