/**
 * Google Custom Search API 크롤러 테스트
 * 
 * 실행 방법:
 * 1. CRAWLER_TYPE 환경 변수를 'google'로 설정
 * 2. 실행: node Test/test-google-crawler.js
 * 
 * 참고: API 키와 검색 엔진 ID는 코드에 직접 포함되어 있습니다.
 */

// 환경 변수 설정 (테스트용)
process.env.CRAWLER_TYPE = 'google';

// 필요한 모듈 가져오기
const { getCrawler } = require('../dist/crawlers');

// 테스트 함수
async function testGoogleCrawler() {
  try {
    console.log('Google Custom Search API 크롤러 테스트 시작...');
    console.log('API 키와 검색 엔진 ID는 코드에 직접 포함되어 있습니다.');
    console.log('- API 키: AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4');
    console.log('- 검색 엔진 ID: 33616c3af044d4a62');

    
    // 크롤러 인스턴스 가져오기
    const crawler = await getCrawler('google');
    console.log('Google 크롤러 인스턴스 생성 완료');
    
    // 테스트 검색 쿼리
    const query = '인공지능 최신 연구 동향';
    console.log(`검색 쿼리: "${query}"`);
    
    // 검색 수행
    const result = await crawler.search(query, { limit: 5 });
    
    // 결과 출력
    console.log('\n검색 결과:');
    console.log('='.repeat(50));
    
    if (result.data && result.data.length > 0) {
      result.data.forEach((item, index) => {
        console.log(`\n[${index + 1}] ${item.title || '제목 없음'}`);
        console.log(`URL: ${item.url}`);
        console.log(`내용: ${item.markdown || '내용 없음'}`);
        console.log('-'.repeat(50));
      });
      
      console.log(`\n총 ${result.data.length}개의 결과를 찾았습니다.`);
    } else {
      console.log('검색 결과가 없습니다.');
    }
    
    console.log('\n테스트 완료!');
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
  }
}

// 테스트 실행
testGoogleCrawler();
