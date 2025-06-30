/**
 * 구글 검색 + Playwright 간소화 테스트
 * 첫 번째 검색 결과만 크롤링
 */

const axios = require('axios');
const { chromium } = require('playwright');

// API 키와 검색 엔진 ID 설정
const API_KEY = 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
const SEARCH_ENGINE_ID = '33616c3af044d4a62';

/**
 * 구글 검색 결과에서 첫 번째 URL 추출
 */
async function getFirstGoogleSearchResult(query) {
  try {
    console.log(`[Google Search] 검색 쿼리: "${query}"`);
    
    // Google Custom Search API 호출
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: 1 // 첫 번째 결과만 가져오기
      }
    });
    
    // 검색 결과 추출
    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      console.log(`[Google Search] 검색 결과: ${item.title}`);
      console.log(`[Google Search] URL: ${item.link}`);
      return {
        title: item.title,
        url: item.link,
        snippet: item.snippet
      };
    } else {
      console.log('[Google Search] 검색 결과가 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('[Google Search] 오류 발생:', error.message);
    return null;
  }
}

/**
 * Playwright로 단일 URL 크롤링
 */
async function crawlSingleUrl(url) {
  let browser = null;
  
  try {
    console.log(`[Playwright] 크롤링 시작: ${url}`);
    
    // 브라우저 실행 - 로컬 Chrome 사용
    browser = await chromium.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    console.log('[Playwright] 브라우저 실행 성공');
    
    // 페이지 생성
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('[Playwright] 페이지 생성 성공');
    
    // 타임아웃 설정 - 20초로 줄임
    await page.setDefaultTimeout(20000);
    
    // URL 방문
    console.log(`[Playwright] URL 접속 시도: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' }); // networkidle 대신 domcontentloaded 사용
    console.log('[Playwright] 페이지 로드 성공');
    
    // 페이지 타이틀 가져오기
    const title = await page.title();
    console.log(`[Playwright] 페이지 타이틀: ${title}`);
    
    // 텍스트 콘텐츠 추출
    const textContent = await page.evaluate(() => document.body.innerText);
    console.log(`[Playwright] 텍스트 추출 성공: ${textContent.length} 자`);
    
    // 스크린샷 저장
    try {
      const filename = `screenshots/result.png`;
      await page.screenshot({ path: filename });
      console.log(`[Playwright] 스크린샷 저장: ${filename}`);
    } catch (screenshotError) {
      console.log(`[Playwright] 스크린샷 저장 실패: ${screenshotError.message}`);
    }
    
    // 결과 반환
    return {
      title: title,
      textContent: textContent.substring(0, 500) + '...' // 처음 500자만 반환
    };
  } catch (error) {
    console.error('[Playwright] 크롤링 오류:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('[Playwright] 브라우저 종료');
    }
  }
}

/**
 * 간소화된 통합 테스트
 */
async function simplifiedTest() {
  try {
    console.log('===== 간소화된 Google + Playwright 테스트 시작 =====');
    
    // 1. 구글 검색 수행
    const searchResult = await getFirstGoogleSearchResult('인공지능 최신 기술');
    
    if (!searchResult) {
      console.log('검색 결과가 없어 테스트를 종료합니다.');
      return;
    }
    
    // 2. 검색 결과 URL 크롤링
    console.log('\n===== 검색 결과 크롤링 시작 =====');
    const crawlResult = await crawlSingleUrl(searchResult.url);
    
    // 3. 결과 출력
    if (crawlResult) {
      console.log('\n===== 크롤링 결과 =====');
      console.log(`제목: ${crawlResult.title}`);
      console.log(`내용 미리보기: ${crawlResult.textContent}`);
      console.log('===== 테스트 성공적으로 완료 =====');
    } else {
      console.log('===== 크롤링 실패 =====');
    }
  } catch (error) {
    console.error('===== 테스트 중 오류 발생 =====');
    console.error(error);
  }
}

// 테스트 실행
console.log('스크립트 시작');
simplifiedTest()
  .then(() => console.log('스크립트 완료'))
  .catch(err => console.error('스크립트 오류:', err));
