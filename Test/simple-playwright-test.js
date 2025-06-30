/**
 * 간단한 Playwright 테스트
 * 로컬 Chrome 브라우저를 사용하여 웹페이지 접근
 */

const { chromium } = require('playwright');

async function simplePlaywrightTest() {
  console.log('===== 간단한 Playwright 테스트 시작 =====');
  let browser = null;
  
  try {
    console.log('로컬 Chrome 브라우저를 사용하여 실행합니다.');
    browser = await chromium.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    
    console.log('브라우저 실행 성공');
    
    // 페이지 생성
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('페이지 생성 성공');
    
    // 구글 접속
    console.log('https://www.google.com 접속 시도...');
    await page.goto('https://www.google.com', { waitUntil: 'networkidle' });
    console.log('페이지 로드 성공');
    
    // 페이지 타이틀 가져오기
    const title = await page.title();
    console.log(`페이지 타이틀: ${title}`);
    
    // 간단한 스크린샷 저장
    await page.screenshot({ path: 'google.png' });
    console.log('스크린샷 저장 완료: google.png');
    
    console.log('===== 테스트 성공적으로 완료 =====');
  } catch (error) {
    console.error('===== 테스트 실패 =====');
    console.error('오류 내용:', error);
  } finally {
    // 브라우저 종료
    if (browser) {
      await browser.close();
      console.log('브라우저 종료 완료');
    }
  }
}

// 테스트 실행
console.log('스크립트 시작');
simplePlaywrightTest()
  .then(() => console.log('스크립트 완료'))
  .catch(err => {
    console.error('스크립트 실행 중 오류 발생:');
    console.error(err);
  });
