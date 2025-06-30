/**
 * Google Custom Search API + 간단한 웹 크롤링 통합 테스트
 * 구글 검색 결과에서 URL을 추출하여 간단한 크롤링 수행
 */

// 필요한 모듈 가져오기
const axios = require('axios');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// API 키와 검색 엔진 ID 설정
const API_KEY = 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
const SEARCH_ENGINE_ID = '33616c3af044d4a62';

// Python 경로 설정 (환경 변수에서 가져오거나 기본값 사용)
const PYTHON_PATH = process.env.PYTHON_PATH || 'C:\\Users\\user\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';

/**
 * 구글 검색 결과에서 URL 추출 함수
 * @param {string} query 검색 쿼리
 * @param {number} numResults 가져올 결과 수
 * @returns {Promise<Array<{title: string, url: string, snippet: string}>>} 추출된 검색 결과 배열
 */
async function getGoogleSearchResults(query, numResults = 3) {
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
          snippet: item.snippet || '내용 없음'
        });
      });
      
      console.log(`[Google Search] ${results.length}개의 검색 결과를 추출했습니다.`);
    } else {
      console.log('[Google Search] 검색 결과가 없습니다.');
    }
    
    return results;
  } catch (error) {
    console.error('[Google Search] 오류 발생:', error.message);
    console.error('[Google Search] 상세 오류:', error.response?.data || error);
    return [];
  }
}

/**
 * 간단한 웹 크롤링 함수 (axios 사용)
 * @param {string} url 크롤링할 URL
 * @returns {Promise<string>} 크롤링 결과 (HTML 또는 텍스트)
 */
async function simpleCrawl(url) {
  try {
    console.log(`[Simple Crawler] URL 크롤링 시작: ${url}`);
    
    // URL 직접 크롤링
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    console.log(`[Simple Crawler] URL 크롤링 완료: ${url} (${response.data.length} 바이트)`);
    return response.data;
  } catch (error) {
    console.error(`[Simple Crawler] URL 크롤링 오류 (${url}):`, error.message);
    return null;
  }
}

/**
 * HTML에서 텍스트 추출 (간단한 구현)
 * @param {string} html HTML 문자열
 * @returns {string} 추출된 텍스트
 */
function extractTextFromHtml(html) {
  if (!html) return '';
  
  // 간단한 HTML 태그 제거 (정교한 파싱이 필요하면 cheerio 같은 라이브러리 사용 권장)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ') // 스크립트 제거
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')    // 스타일 제거
    .replace(/<[^>]+>/g, ' ')                                           // HTML 태그 제거
    .replace(/\s+/g, ' ')                                               // 연속된 공백 제거
    .trim();
}

/**
 * 통합 테스트 함수
 */
async function testGoogleCrawlIntegration() {
  try {
    console.log('===== Google + 웹 크롤링 통합 테스트 시작 =====');
    
    // 1. 검색 쿼리 설정
    const query = '인공지능 최신 기술';
    
    // 2. 구글 검색 결과 가져오기
    const searchResults = await getGoogleSearchResults(query, 2); // 처음 2개 결과만 테스트
    
    if (searchResults.length === 0) {
      console.log('검색 결과가 없어 테스트를 종료합니다.');
      return;
    }
    
    // 3. 각 URL에 대해 크롤링
    console.log('\n===== 검색 결과 크롤링 시작 =====');
    
    const crawlResults = [];
    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      console.log(`\n[${i+1}/${searchResults.length}] 처리 중: ${result.title}`);
      console.log(`URL: ${result.url}`);
      
      // URL 크롤링
      const htmlContent = await simpleCrawl(result.url);
      
      if (htmlContent) {
        // HTML에서 텍스트 추출
        const textContent = extractTextFromHtml(htmlContent);
        const textSummary = textContent.substring(0, 500) + '...'; // 처음 500자만 표시
        
        crawlResults.push({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          textSummary
        });
        
        console.log(`크롤링 성공: ${textContent.length} 자 추출`);
      } else {
        console.log(`크롤링 실패`);
        crawlResults.push({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          textSummary: '크롤링 실패'
        });
      }
    }
    
    // 4. 결과 출력
    console.log('\n===== 크롤링 결과 요약 =====');
    crawlResults.forEach((item, index) => {
      console.log(`\n[${index+1}] ${item.title}`);
      console.log(`URL: ${item.url}`);
      console.log(`구글 요약: ${item.snippet}`);
      console.log(`크롤링 내용: ${item.textSummary}`);
      console.log('-'.repeat(50));
    });
    
    console.log(`\n총 ${crawlResults.length}개의 URL을 처리했습니다.`);
    console.log('\n===== 통합 테스트 완료 =====');
    
  } catch (error) {
    console.error('통합 테스트 중 오류 발생:', error);
  }
}

// 테스트 실행
testGoogleCrawlIntegration();
