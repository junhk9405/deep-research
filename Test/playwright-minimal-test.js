/**
 * Playwright 최소 테스트
 * 매우 간단한 웹사이트만 접속하여 테스트
 */

const { chromium } = require('playwright');

async function minimalPlaywrightTest() {
  let browser = null;
  
  try {
    console.log('===== Playwright 최소 테스트 시작 =====');
    
    // 브라우저 실행 - 로컬 Chrome 사용
    console.log('브라우저 시작 중...');
    browser = await chromium.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    console.log('브라우저 실행 성공');
    
    // 페이지 생성
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('페이지 생성 성공');
    
    // 타임아웃 설정 - 10초로 줄임
    await page.setDefaultTimeout(10000);
    
    // 간단한 웹사이트 접속 (Google)
    console.log('Google.com 접속 시도...');
    await page.goto('https://www.google.com', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    console.log('페이지 로드 성공');
    
    // 페이지 타이틀 가져오기
    const title = await page.title();
    console.log(`페이지 타이틀: ${title}`);
    
    // 스크린샷 저장
    await page.screenshot({ path: 'screenshots/google.png' });
    console.log('스크린샷 저장 완료');
    
    console.log('===== 테스트 성공 =====');
    return true;
  } catch (error) {
    console.error('===== 테스트 실패 =====');
    console.error('오류 내용:', error.message);
    return false;
  } finally {
    if (browser) {
      console.log('브라우저 종료 중...');
      await browser.close();
      console.log('브라우저 종료 완료');
    }
    console.log('===== 테스트 종료 =====');
  }
}

// 테스트 실행
console.log('스크립트 시작');
minimalPlaywrightTest()
  .then(success => {
    if (success) {
      console.log('테스트가 성공적으로 완료되었습니다.');
    } else {
      console.log('테스트가 실패했습니다.');
    }
  })
  .catch(err => {
    console.error('예상치 못한 오류 발생:', err);
  })
  .finally(() => {
    console.log('스크립트 종료');
  });
