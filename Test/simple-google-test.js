/**
 * Google Custom Search API 간단 테스트
 */

// 직접 axios 사용
const axios = require('axios');

// API 키와 검색 엔진 ID 설정
const API_KEY = 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
const SEARCH_ENGINE_ID = '33616c3af044d4a62';

// 간단한 테스트 함수
async function testGoogleSearch() {
  try {
    console.log('Google Custom Search API 간단 테스트 시작...');
    
    // 검색 쿼리
    const query = '인공지능 최신 기술';
    console.log(`검색 쿼리: "${query}"`);
    
    // Google Custom Search API 직접 호출
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: 3 // 결과 수 제한
      }
    });
    
    // 결과 출력
    console.log('\n검색 결과:');
    console.log('='.repeat(50));
    
    if (response.data.items && response.data.items.length > 0) {
      response.data.items.forEach((item, index) => {
        console.log(`\n[${index + 1}] ${item.title || '제목 없음'}`);
        console.log(`URL: ${item.link}`);
        console.log(`내용: ${item.snippet || '내용 없음'}`);
        console.log('-'.repeat(50));
      });
      
      console.log(`\n총 ${response.data.items.length}개의 결과를 찾았습니다.`);
    } else {
      console.log('검색 결과가 없습니다.');
    }
    
    console.log('\n테스트 완료!');
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
    console.error('오류 내용:', error.response?.data || error.message);
  }
}

// 테스트 실행
testGoogleSearch();
