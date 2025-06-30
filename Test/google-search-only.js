/**
 * 구글 검색 API만 사용하는 테스트
 * 검색 결과의 snippet(요약) 정보만 활용
 */

const axios = require('axios');

// API 키와 검색 엔진 ID 설정
const API_KEY = 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
const SEARCH_ENGINE_ID = '33616c3af044d4a62';

/**
 * 구글 검색 API를 사용하여 검색 결과 가져오기
 * @param {string} query 검색 쿼리
 * @param {number} numResults 가져올 결과 수
 * @returns {Promise<Array>} 검색 결과 배열
 */
async function googleSearch(query, numResults = 5) {
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
    
    // 검색 결과 추출
    const results = [];
    if (response.data.items && response.data.items.length > 0) {
      response.data.items.forEach((item) => {
        results.push({
          title: item.title || '제목 없음',
          url: item.link,
          snippet: item.snippet || '내용 없음',
          displayLink: item.displayLink || '',
          formattedUrl: item.formattedUrl || item.link
        });
      });
      
      console.log(`[Google Search] ${results.length}개의 검색 결과를 추출했습니다.`);
    } else {
      console.log('[Google Search] 검색 결과가 없습니다.');
    }
    
    return results;
  } catch (error) {
    console.error('[Google Search] 오류 발생:', error.message);
    if (error.response) {
      console.error('[Google Search] 응답 데이터:', error.response.data);
    }
    return [];
  }
}

/**
 * 검색 결과 분석 및 요약
 * @param {Array} searchResults 검색 결과 배열
 * @returns {string} 요약 정보
 */
function analyzeSearchResults(searchResults) {
  if (!searchResults || searchResults.length === 0) {
    return '검색 결과가 없습니다.';
  }
  
  let summary = `총 ${searchResults.length}개의 검색 결과가 있습니다.\n\n`;
  
  searchResults.forEach((result, index) => {
    summary += `[${index + 1}] ${result.title}\n`;
    summary += `URL: ${result.url}\n`;
    summary += `출처: ${result.displayLink}\n`;
    summary += `요약: ${result.snippet}\n\n`;
  });
  
  return summary;
}

/**
 * 메인 테스트 함수
 */
async function testGoogleSearchOnly() {
  try {
    console.log('===== 구글 검색 API 테스트 시작 =====\n');
    
    // 검색 쿼리 설정
    const query = '인공지능 최신 기술';
    
    // 구글 검색 수행
    const searchResults = await googleSearch(query);
    
    // 검색 결과 분석 및 요약
    const summary = analyzeSearchResults(searchResults);
    
    // 결과 출력
    console.log('\n===== 검색 결과 요약 =====\n');
    console.log(summary);
    
    console.log('===== 테스트 완료 =====');
    
    return searchResults;
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
    return [];
  }
}

// 테스트 실행
console.log('스크립트 시작');
testGoogleSearchOnly()
  .then(results => {
    console.log(`검색 결과 ${results.length}개를 성공적으로 처리했습니다.`);
    console.log('스크립트 종료');
  })
  .catch(err => {
    console.error('스크립트 오류:', err);
  });
