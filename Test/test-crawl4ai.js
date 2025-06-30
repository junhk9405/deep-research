/**
 * crawl4ai 테스트 스크립트
 */

// 환경 변수 설정 (NODE_TLS_REJECT_UNAUTHORIZED=0)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// crawl4ai 클라이언트 가져오기
const { Crawl4aiCrawler } = require('../dist/crawlers/crawl4ai/client');

// 테스트 함수
async function testCrawl4ai() {
  try {
    console.log('crawl4ai 테스트 시작...');
    
    // crawl4ai 클라이언트 생성
    const crawler = new Crawl4aiCrawler();
    
    // 검색 쿼리
    const query = 'What is artificial intelligence?';
    
    console.log(`검색 쿼리: "${query}"`);
    
    // 검색 실행
    const result = await crawler.search(query, {
      timeout: 30000,
      limit: 2, // URL 개수 2개로 제한
      scrapeOptions: {
        maxTokens: 50000
      }
    });
    
    // 결과 출력
    console.log('검색 결과:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('crawl4ai 테스트 완료!');
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
  }
}

// 테스트 실행
testCrawl4ai();
