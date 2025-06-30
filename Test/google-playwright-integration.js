/**
 * Google Custom Search API + Playwright 통합 테스트
 * 구글 검색 결과에서 URL을 추출하여 Playwright로 크롤링
 */

// 필요한 모듈 가져오기
const axios = require('axios');
const { chromium } = require('playwright');

// API 키와 검색 엔진 ID 설정
const API_KEY = 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
const SEARCH_ENGINE_ID = '33616c3af044d4a62';

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
 * Playwright를 사용한 웹 크롤링 함수
 * @param {string} url 크롤링할 URL
 * @returns {Promise<string>} 크롤링 결과 (텍스트)
 */
async function playwrightCrawl(url) {
  let browser = null;
  
  try {
    console.log(`[Playwright] URL 크롤링 시작: ${url}`);
    
    // 브라우저 실행 (executablePath 옵션을 사용하여 수동으로 설치한 브라우저 경로 지정 가능)
    console.log('[Playwright] 로컬 Chrome 브라우저를 사용하여 실행합니다.');
    browser = await chromium.launch({
      headless: true,
      // 로컬 Chrome 브라우저 경로 직접 지정
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    console.log('[Playwright] 브라우저 실행 성공');
    
    // 페이지 생성
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('[Playwright] 페이지 생성 성공');
    
    // 페이지 로드 타임아웃 설정 (30초)
    await page.setDefaultTimeout(30000);
    
    // URL 방문
    console.log(`[Playwright] URL 방문 시도: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log(`[Playwright] URL 방문 성공: ${url}`);
    
    // 페이지 텍스트 추출
    console.log('[Playwright] 페이지 콘텐츠 추출 시도');
    const content = await page.content();
    const textContent = await page.evaluate(() => document.body.innerText);
    
    // 스크린샷 저장 (선택사항)
    const screenshotPath = `screenshots/${url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.png`;
    try {
      await page.screenshot({ path: screenshotPath });
      console.log(`[Playwright] 스크린샷 저장 성공: ${screenshotPath}`);
    } catch (screenshotError) {
      console.log(`[Playwright] 스크린샷 저장 실패: ${screenshotError.message}`);
    }
    
    console.log(`[Playwright] URL 크롤링 완료: ${url} (${textContent.length} 자)`);
    return textContent;
  } catch (error) {
    console.error(`[Playwright] URL 크롤링 오류 (${url}):`, error.message);
    console.error(`[Playwright] 상세 오류:`, error);
    return null;
  } finally {
    // 브라우저 종료
    if (browser) {
      await browser.close();
      console.log('[Playwright] 브라우저 종료 완료');
    }
  }
}

/**
 * 통합 테스트 함수
 */
async function testGooglePlaywrightIntegration() {
  try {
    console.log('===== Google + Playwright 통합 테스트 시작 =====');
    
    // 1. 검색 쿼리 설정
    const query = '인공지능 최신 기술';
    
    // 2. 구글 검색 결과 가져오기
    const searchResults = await getGoogleSearchResults(query, 2); // 처음 2개 결과만 테스트
    
    if (searchResults.length === 0) {
      console.log('검색 결과가 없어 테스트를 종료합니다.');
      return;
    }
    
    // 3. 각 URL에 대해 Playwright로 크롤링
    console.log('\n===== 검색 결과 크롤링 시작 =====');
    
    const crawlResults = [];
    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      console.log(`\n[${i+1}/${searchResults.length}] 처리 중: ${result.title}`);
      console.log(`URL: ${result.url}`);
      
      // URL 크롤링
      const textContent = await playwrightCrawl(result.url);
      
      if (textContent) {
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
console.log('===== 테스트 시작 =====');
testGooglePlaywrightIntegration()
  .then(() => console.log('===== 테스트 완료 ====='))
  .catch(err => {
    console.error('===== 테스트 실패 =====');
    console.error(err);
  });
