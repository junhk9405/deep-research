/**
 * Google Custom Search API + Crawl4ai 통합 테스트
 * 구글 검색 결과에서 URL을 추출하여 Crawl4ai로 전달하는 테스트
 */

// 환경 변수 설정 (NODE_TLS_REJECT_UNAUTHORIZED=0)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 필요한 모듈 가져오기
const axios = require('axios');
const { Crawl4aiCrawler } = require('./src/crawlers/crawl4ai/client');

// API 키와 검색 엔진 ID 설정
const API_KEY = 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
const SEARCH_ENGINE_ID = '33616c3af044d4a62';

/**
 * 구글 검색 결과에서 URL 추출 함수
 * @param {string} query 검색 쿼리
 * @param {number} numResults 가져올 결과 수
 * @returns {Promise<Array<string>>} 추출된 URL 배열
 */
async function getGoogleSearchUrls(query, numResults = 3) {
  try {
    console.log(`[Google Search] 검색 쿼리: "${query}"`);
    
    // Google Custom Search API 호출
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: numResults
      }
    });
    
    // 검색 결과에서 URL 추출
    const urls = [];
    if (response.data.items && response.data.items.length > 0) {
      response.data.items.forEach((item) => {
        if (item.link) {
          urls.push(item.link);
        }
      });
      
      console.log(`[Google Search] ${urls.length}개의 URL을 추출했습니다.`);
    } else {
      console.log('[Google Search] 검색 결과가 없습니다.');
    }
    
    return urls;
  } catch (error) {
    console.error('[Google Search] 오류 발생:', error.message);
    console.error('[Google Search] 상세 오류:', error.response?.data || error);
    return [];
  }
}

/**
 * Crawl4ai로 URL 크롤링 함수
 * @param {string} url 크롤링할 URL
 * @returns {Promise<Object>} 크롤링 결과
 */
async function crawlUrlWithCrawl4ai(url) {
  try {
    console.log(`[Crawl4ai] URL 크롤링 시작: ${url}`);
    
    // Crawl4ai 클라이언트 생성
    const crawler = new Crawl4aiCrawler();
    
    // URL 직접 크롤링 (search 메서드에 URL을 전달)
    const result = await crawler.search(url, {
      timeout: 30000,
      scrapeOptions: {
        maxTokens: 50000
      }
    });
    
    console.log(`[Crawl4ai] URL 크롤링 완료: ${url}`);
    return result;
  } catch (error) {
    console.error(`[Crawl4ai] URL 크롤링 오류 (${url}):`, error);
    return null;
  }
}

/**
 * 통합 테스트 함수
 */
async function testGoogleCrawl4aiIntegration() {
  try {
    console.log('===== Google + Crawl4ai 통합 테스트 시작 =====');
    
    // 1. 검색 쿼리 설정
    const query = '인공지능 최신 기술';
    
    // 2. 구글 검색 결과에서 URL 추출
    const urls = await getGoogleSearchUrls(query, 2); // 처음 2개 URL만 테스트
    
    if (urls.length === 0) {
      console.log('추출된 URL이 없어 테스트를 종료합니다.');
      return;
    }
    
    // 3. 각 URL에 대해 Crawl4ai로 크롤링
    console.log('\n===== 추출된 URL 크롤링 시작 =====');
    
    const results = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`\n[${i+1}/${urls.length}] URL 처리 중: ${url}`);
      
      const result = await crawlUrlWithCrawl4ai(url);
      if (result) {
        results.push({
          url,
          result
        });
      }
    }
    
    // 4. 결과 출력
    console.log('\n===== 크롤링 결과 요약 =====');
    results.forEach((item, index) => {
      console.log(`\n[${index+1}] URL: ${item.url}`);
      
      // 결과 요약 출력 (전체 결과는 너무 길 수 있음)
      if (item.result.content && item.result.content.length > 0) {
        const contentSummary = item.result.content[0].content.substring(0, 200) + '...';
        console.log(`내용 요약: ${contentSummary}`);
      } else {
        console.log('내용 없음');
      }
      
      console.log('-'.repeat(50));
    });
    
    console.log(`\n총 ${results.length}개의 URL을 성공적으로 크롤링했습니다.`);
    console.log('\n===== 통합 테스트 완료 =====');
    
  } catch (error) {
    console.error('통합 테스트 중 오류 발생:', error);
  }
}

// 테스트 실행
testGoogleCrawl4aiIntegration();
