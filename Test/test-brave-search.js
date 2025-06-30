/**
 * Brave Search API 크롤러 테스트 (crawl4ai + Brave Search)
 */

const { getCrawler } = require('../dist/crawlers/index');

// 환경변수 직접 설정 (테스트용)
if (!process.env.BRAVE_SEARCH_API_KEY) {
  process.env.BRAVE_SEARCH_API_KEY = 'BSAiNtT0SLGzuuk88aPOcqsxX4PNlUY';
}

// Brave Search 사용하도록 설정
process.env.SEARCH_PROVIDER = 'brave';

async function testBraveSearch() {
  try {
    console.log('🧪 Brave Search + crawl4ai 크롤러 테스트 시작...\n');
    console.log(`📋 검색 제공자: ${process.env.SEARCH_PROVIDER}`);

    // 환경변수에 API 키가 설정되어 있는지 확인
    if (!process.env.BRAVE_SEARCH_API_KEY) {
      console.log('⚠️ BRAVE_SEARCH_API_KEY 환경변수가 설정되지 않았습니다.');
      console.log('테스트를 위해 .env.local 파일에 API 키를 추가해주세요.');
      return;
    }

    // crawl4ai 크롤러 초기화 (SEARCH_PROVIDER=brave로 설정됨)
    const crawler = await getCrawler('crawl4ai');
    console.log('✅ crawl4ai 크롤러 (Brave Search) 초기화 완료\n');

    // 테스트 검색 쿼리 (영어로 테스트)
    const testQueries = [
      'AI technology trends 2024'
    ];

    for (const query of testQueries) {
      console.log(`🔍 검색 테스트: "${query}"`);
      
      try {
        const result = await crawler.search(query, { limit: 5 });
        
        console.log(`📊 검색 결과: ${result.data.length}개`);
        
        if (result.data.length > 0) {
          console.log('📋 첫 번째 결과:');
          const firstResult = result.data[0];
          console.log(`   제목: ${firstResult.title}`);
          console.log(`   URL: ${firstResult.url}`);
          console.log(`   설명: ${firstResult.markdown?.substring(0, 100)}...`);
          
          if (firstResult.meta) {
            console.log(`   언어: ${firstResult.meta.language}`);
            console.log(`   페이지 나이: ${firstResult.meta.age}`);
          }
        }
        
        console.log('✅ 검색 성공\n');
        
        // Rate limiting을 위한 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ 검색 실패: ${error.message}\n`);
      }
    }

    // Rate Limiter 상태 확인
    if (crawler.getRateLimitStatus) {
      const status = crawler.getRateLimitStatus();
      console.log('🚦 Rate Limiter 상태:');
      console.log(`   최근 1분간 요청: ${status.requestsInLastMinute}/${status.maxRequests}`);
    }

    console.log('🎉 Brave Search 크롤러 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

// 테스트 실행
if (require.main === module) {
  testBraveSearch();
}

module.exports = { testBraveSearch };
