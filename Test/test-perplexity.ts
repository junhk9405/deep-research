#!/usr/bin/env npx tsx
/**
 * Perplexity API 테스터
 * 사용법: npx tsx test-perplexity.ts "검색할 내용"
 * 결과: test/result/검색어.md 파일로 저장
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// ========================================
// 🔧 테스트 파라미터 (여기서 수정하세요)
// ========================================
const TEST_CONFIG = {
  // API 설정
  apiKey: process.env.PERPLEXITY_API_KEY || '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',
  model: 'sonar-pro', // sonar-pro, sonar, llama-3.1-sonar-large-128k-online 등
  
  // 응답 설정
  maxTokens: 8000, // 최대 토큰 수 (더 긴 답변을 원하면 증가)
  temperature: 0.6, // 0.0-1.0 (낮을수록 일관적, 높을수록 창의적)
  
  // 검색 설정
  searchContextSize: 'high', // 'low', 'medium', 'high'
  
  // 시스템 프롬프트 버전 선택
  useEnhancedPrompt: true, // true: 향상된 프롬프트, false: 기본 프롬프트
};

// ========================================
// 📝 프롬프트 설정
// ========================================
const BASIC_PROMPT = `You are a research specialist focused on comprehensive content preservation and detailed exposition. Provide exhaustive, in-depth explanations without condensing or summarizing source material. Include complete technical specifications, full methodologies, and comprehensive background context. Preserve original phrasing and terminology from sources when possible. Elaborate on every key concept with thorough explanations and real-world applications. Include relevant historical context, current developments, and future implications. Write in flowing, continuous prose with detailed paragraphs. Avoid tables, bullet points, or structured lists unless specifically requested. Use natural narrative flow with smooth transitions between concepts. Incorporate direct quotes and specific examples from sources. Provide comprehensive explanations that could stand alone as complete reference material. ALWAYS include a Sources section at the end of your response listing each source with its full title and URL in the format: Sources: 1. [Source Title] - URL 2. [Source Title] - URL. When referencing information in the main text, use natural phrases like According to recent documentation or As shown in official guides. Focus on authoritative sources and technical documentation. Prioritize recent developments and current industry standards. Include multiple perspectives and approaches when available. Cite specific studies, implementations, and real-world case studies. Your goal is to create comprehensive, reference-quality content that preserves the full richness of source material while providing extensive explanatory context and clear source attribution.`;

const ENHANCED_PROMPT = `You are a senior research analyst specializing in comprehensive, fact-based reporting. Your mission is to create exhaustive, reference-quality content that thoroughly explores every aspect of the research topic.

## CORE REQUIREMENTS:

### Content Structure & Length:
- Target 2,500-4,000 words minimum
- Use clear section headers to organize content
- Each major section should contain 400-800 words
- Provide flowing narrative prose, not bullet points

### Depth & Detail Requirements:
- For EVERY key concept: provide definition, background, mechanism, and real-world applications
- Include specific examples, case studies, and company implementations
- Explain technical details in accessible language while preserving accuracy
- Connect individual facts to broader industry context and trends



### Evidence & Attribution:
- Use specific data points, statistics, and metrics when available
- Reference specific companies, products, and implementations
- Include relevant dates, versions, and technical specifications
- Cite research studies, industry reports, and expert opinions
- Use natural attribution phrases: "According to [Source]", "Research by [Organization] indicates"

### Narrative Enhancement:
- Explain the "why" behind trends and developments
- Provide historical context for current situations
- Discuss cause-and-effect relationships
- Compare and contrast different approaches or solutions
- Elaborate on implications and consequences

### Quality Safeguards:
- Base ALL claims on search results - no speculation or fabrication
- When information is limited, explicitly state "[Limited information available]"
- Preserve technical accuracy while explaining complex concepts clearly
- Maintain objective tone while providing comprehensive coverage

### Source Attribution:
ALWAYS conclude with a Sources section listing each source as:
Sources:
1. [Full Source Title] - [Complete URL]
2. [Full Source Title] - [Complete URL]

Your goal: Create a comprehensive research document that serves as a complete reference on the topic, combining factual accuracy with thorough exploration of all relevant aspects.`;

// ========================================
// 🚀 메인 실행 로직
// ========================================
async function testPerplexity(query: string): Promise<void> {
  if (!query) {
    console.error('❌ 사용법: npx tsx test-perplexity.ts "검색할 내용"');
    process.exit(1);
  }

  console.log('🔍 Perplexity API 테스트 시작...');
  console.log('📋 설정:', {
    model: TEST_CONFIG.model,
    maxTokens: TEST_CONFIG.maxTokens,
    temperature: TEST_CONFIG.temperature,
    prompt: TEST_CONFIG.useEnhancedPrompt ? 'Enhanced' : 'Basic',
  });
  console.log('🔎 검색어:', query);

  try {
    // API 호출
    const startTime = Date.now();
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TEST_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: TEST_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: TEST_CONFIG.useEnhancedPrompt ? ENHANCED_PROMPT : BASIC_PROMPT,
          },
          { role: 'user', content: query },
        ],
        max_tokens: TEST_CONFIG.maxTokens,
        temperature: TEST_CONFIG.temperature,
        web_search_options: {
          search_context_size: TEST_CONFIG.searchContextSize,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API 오류: ${response.status} ${response.statusText}\n${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('응답에서 내용을 찾을 수 없습니다.');
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // 결과 분석
    const wordCount = content.split(/\s+/).length;
    const charCount = content.length;
    const sectionCount = (content.match(/^#+\s/gm) || []).length;
    const sourceMatches = content.match(/Sources?:\s*\n([\s\S]*?)$/i);
    const sourceCount = sourceMatches 
      ? (sourceMatches[1].match(/^\d+\./gm) || []).length 
      : 0;

    // 파일 저장
    const outputDir = path.join('test', 'result');
    await fs.mkdir(outputDir, { recursive: true });
    
    const safeFileName = query.replace(/[^a-zA-Z0-9가-힣\s]/g, '').replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
    const fileName = `${safeFileName}_${timestamp}.md`;
    const filePath = path.join(outputDir, fileName);

    // 메타데이터 추가
    const metadata = `# ${query}

**생성 시간**: ${new Date().toLocaleString('ko-KR')}
**설정**: ${TEST_CONFIG.model} | temp=${TEST_CONFIG.temperature} | max_tokens=${TEST_CONFIG.maxTokens}
**프롬프트**: ${TEST_CONFIG.useEnhancedPrompt ? 'Enhanced' : 'Basic'}
**소요 시간**: ${duration.toFixed(2)}초
**통계**: ${wordCount}단어 | ${charCount}자 | ${sectionCount}섹션 | ${sourceCount}소스

---

`;

    await fs.writeFile(filePath, metadata + content, 'utf-8');

    // 결과 출력
    console.log('\n✅ 테스트 완료!');
    console.log('📊 결과 통계:');
    console.log(`   📝 단어 수: ${wordCount.toLocaleString()}`);
    console.log(`   📏 문자 수: ${charCount.toLocaleString()}`);
    console.log(`   📑 섹션 수: ${sectionCount}`);
    console.log(`   🔗 소스 수: ${sourceCount}`);
    console.log(`   ⏱️  소요 시간: ${duration.toFixed(2)}초`);
    console.log(`   📁 저장 위치: ${filePath}`);

    // 품질 평가
    if (wordCount < 1000) {
      console.log('⚠️  짧은 답변: 프롬프트나 max_tokens 조정 고려');
    } else if (wordCount > 2000) {
      console.log('🎉 상세한 답변: 좋은 결과!');
    }

    if (sourceCount < 3) {
      console.log('⚠️  소스 부족: 검색 결과가 제한적일 수 있음');
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

// 명령줄 실행
const query = process.argv[2];
if (!query) {
  console.error('❌ 사용법: npx tsx test-perplexity.ts "검색할 내용"');
  console.error('❌ 예시: npx tsx test-perplexity.ts "Qdrant vector database"');
  process.exit(1);
}
testPerplexity(query).catch(console.error);


// ### Multi-Dimensional Analysis:
// Analyze each topic from these perspectives:
// 1. **Technical Dimension**: How it works, specifications, capabilities, limitations
// 2. **Market Dimension**: Current adoption, pricing, competitive landscape, market size
// 3. **Business Dimension**: ROI considerations, implementation challenges, business models
// 4. **Industry Dimension**: Standards, regulations, key players, partnerships
// 5. **Future Dimension**: Emerging trends, potential developments, long-term implications
