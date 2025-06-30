// Firecrawl API 키 테스트 스크립트
const https = require('https');

const apiKey = 'fc-87dc30ff4bb449c196319b19d7212ca6';
const query = 'test query';

const options = {
  hostname: 'api.firecrawl.dev',
  path: '/api/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
};

const req = https.request(options, (res) => {
  console.log(`상태 코드: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('API 키가 유효합니다!');
      console.log('응답 데이터 일부:', data.substring(0, 200) + '...');
    } else {
      console.log('API 키가 유효하지 않거나 다른 문제가 있습니다.');
      console.log('에러 응답:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('요청 중 오류 발생:', e);
});

// 요청 데이터 작성
const postData = JSON.stringify({
  query: query,
  limit: 1
});

req.write(postData);
req.end();

console.log('Firecrawl API 키 테스트 중...');
