/**
 * crawl4ai 크롤러 구현체
 * Node.js에서 Python 프로세스를 실행하여 crawl4ai를 호출
 */

import axios from 'axios';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Crawler, SearchOptions, SearchResult } from '../index';
import { RateLimiter, RATE_LIMIT_CONFIGS } from '../rate-limiter';

export class Crawl4aiCrawler implements Crawler {
  private pythonPath: string;
  private scriptPath: string;
  private searchProvider: 'google' | 'brave';
  private braveRateLimiter: RateLimiter;
  private googleRateLimiter: RateLimiter;

  constructor() {
    // Python 실행 경로 (환경 변수 또는 기본값)
    this.pythonPath = process.env.PYTHON_PATH || 'C:\\Users\\user\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
    
    // Python 스크립트의 실제 경로를 사용
    this.scriptPath = path.join(__dirname, 'scripts', 'run_crawl4ai.py');

    // 검색 제공자 설정 (환경 변수 또는 기본값)
    this.searchProvider = (process.env.SEARCH_PROVIDER as 'google' | 'brave') || 'google';

    // Rate Limiter 초기화
    this.braveRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.brave);
    this.googleRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.google);

    console.log(`[Crawl4AI] Python 실행 경로: ${this.pythonPath}`);
    console.log(`[Crawl4AI] Python 스크립트 경로: ${this.scriptPath}`);
    console.log(`[Crawl4AI] 검색 제공자: ${this.searchProvider}`);

    if (!fs.existsSync(this.scriptPath)) {
      throw new Error(`Python 스크립트를 찾을 수 없습니다: ${this.scriptPath}`);
    }
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    try {
      console.log(`[${this.searchProvider === 'brave' ? 'BraveSearch' : 'GoogleSearch'}] 쿼리: "${query}"`);

      // 1. 선택된 검색 제공자를 사용하여 검색
      const searchData = this.searchProvider === 'brave' 
        ? await this.fetchBraveSearchResults(query, options)
        : await this.fetchGoogleSearchResults(query);
      
      // 검색 결과 확인 (Google과 Brave의 응답 형식이 다름)
      const hasResults = this.searchProvider === 'brave'
        ? searchData?.web?.results && searchData.web.results.length > 0
        : searchData?.items && searchData.items.length > 0;

      if (!hasResults) {
        console.log(`[${this.searchProvider === 'brave' ? 'BraveSearch' : 'GoogleSearch'}] 검색 결과가 없습니다.`);
        return { data: [] };
      }

      // 2. 검색 결과에서 URL 추출
      let urls = this.searchProvider === 'brave'
        ? searchData.web.results.map((item: any) => item.url)
        : searchData.items.map((item: any) => item.link);
      
      // URL 개수 제한 (options.limit)
      if (options?.limit && options.limit > 0) {
        urls = urls.slice(0, options.limit);
      }
      
      console.log(`[${this.searchProvider === 'brave' ? 'BraveSearch' : 'GoogleSearch'}] ${urls.length}개의 URL을 찾았습니다. 크롤링을 시작합니다...`);
      
      // 3. crawl4ai 실행
      if (urls.length > 0) {
        // 임시 출력 파일 경로 생성
        const outputDir = path.join(os.tmpdir(), 'deep-research-crawl4ai');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputFilePath = path.join(outputDir, `crawl-result-${Date.now()}.json`);

        // Python 스크립트에 전달할 인자 구성
        const args = [
          this.scriptPath,
          '--query',
          query,
          ...urls.flatMap((url: string) => ['--urls', url]),
          '--output',
          outputFilePath,
        ];

        if (options?.timeout) {
          args.push('--timeout', options.timeout.toString());
        }
        if (options?.limit) { // SearchOptions.limit을 --limit으로 전달
          args.push('--limit', options.limit.toString());
        }
        if (options?.scrapeOptions?.maxTokens) {
          args.push('--max-tokens', options.scrapeOptions.maxTokens.toString());
        }
        
        try {
          const commandParts = [this.pythonPath, ...args];
          console.log(`[Crawl4AI] 실행 명령어: ${commandParts.join(' ')}`);

          // Python 프로세스 실행 (stdout/stderr 버퍼링 문제 해결)
          await this.runPythonProcess(args);
          
          // 결과 파일 읽기
          if (fs.existsSync(outputFilePath)) {
            const fileContent = fs.readFileSync(outputFilePath, 'utf-8');
            const crawlResult = JSON.parse(fileContent);
            
            // 임시 파일 삭제
            fs.unlinkSync(outputFilePath);
            
            return this.convertToFirecrawlFormat(crawlResult);
          } else {
            throw new Error('크롤링 결과 파일이 생성되지 않았습니다.');
          }
        } catch (error) {
          console.error('crawl4ai search 중 오류 발생:', error);
          throw error;
        }
      }

      return { data: [] };
    } catch (error) {
      console.error('in crawl4ai search:', error);
      return { data: [] };
    }
  }

  /**
   * Python 프로세스 실행 (stdout/stderr 버퍼링 및 TUI 깨짐 문제 해결)
   * @param args 명령줄 인자
   * @returns 프로세스 실행 결과
   */
  private runPythonProcess(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.pythonPath, args, {
        env: { ...process.env, PYTHONIOENCODING: 'UTF-8' },
      });
      
      let stderr = '';
      
      // 자식 프로세스의 stdout을 부모의 stdout으로 직접 파이핑합니다.
      // 이렇게 하면 crawl4ai의 진행률 표시줄 같은 TUI 출력이 깨지지 않고 그대로 표시됩니다.
      child.stdout.pipe(process.stdout);
      
      // stderr는 에러 메시지를 위해 캡처하면서 동시에 실시간으로 출력합니다.
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      child.stderr.pipe(process.stderr);
      
      child.on('error', (err) => {
        // spawn 자체에서 오류가 발생한 경우 (예: python 경로를 찾을 수 없는 경우)
        console.error('[Crawl4AI] Failed to start Python process.', err);
        reject(err);
      });
  
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          const errorMessage = `Python process exited with code ${code}. Error: ${stderr.trim()}`;
          reject(new Error(errorMessage));
        }
      });
    });
  }
  
  /**
   * crawl4ai 결과를 Firecrawl 형식으로 변환
   * @param result crawl4ai 결과
   * @returns Firecrawl 형식 결과
   */
  private convertToFirecrawlFormat(result: any): SearchResult {
    const items = Array.isArray(result) ? result : (result.results || []);
    
    return {
      data: items.map((item: any) => ({
        url: item.url || '',
        markdown: item.markdown || '',
        // Firecrawl의 다른 필드가 필요하다면 여기에 추가
      }))
    };
  }

  /**
   * Brave Search API 호출 함수 (재시도 로직 포함)
   */
  private async fetchBraveSearchResults(query: string, options?: SearchOptions, maxRetries = 3): Promise<any> {
    const apiKey = process.env.BRAVE_SEARCH_API_KEY || 'BSAiNtT0SLGzuuk88aPOcqsxX4PNlUY';
    
    if (!apiKey) {
      throw new Error('Brave Search API 키가 설정되지 않았습니다.');
    }

    let retries = 0;
    while (retries < maxRetries) {
      try {
        // Rate Limiter 적용
        await this.braveRateLimiter.checkAndWait();
        
        console.log(`[BraveSearch] 검색 중: ${query} (시도: ${retries + 1}/${maxRetries})`);
        
        const params: any = {
          q: query,
          count: options?.limit || 10,
        };

        const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
          params,
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': apiKey,
            'Cache-Control': 'no-cache',
          },
          timeout: options?.timeout || 30000,
          httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false
          }),
        });

        return response.data;
        
      } catch (error: any) {
        console.error(`[BraveSearch] API 호출 오류 (시도 ${retries + 1}):`, error.message);
        
        // 422 오류의 경우 실제 에러 내용을 확인
        if (error.response && error.response.data) {
          console.error(`[BraveSearch] 에러 응답:`, JSON.stringify(error.response.data, null, 2));
        }
        
        if (error.response && error.response.status === 429) {
          const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
          console.log(`[BraveSearch] 요청 한도 초과. ${waitTime / 1000}초 후 재시도합니다...`);
          await this.sleep(waitTime);
          retries++;
        } else {
          throw error; // 재시도 불가능한 오류는 즉시 throw
        }
      }
    }
    throw new Error(`최대 재시도 횟수(${maxRetries})를 초과했습니다.`);
  }

  /**
   * Google Custom Search API 호출 함수 (재시도 로직 포함)
   */
  private async fetchGoogleSearchResults(query: string, maxRetries = 3): Promise<any> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY || 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '33616c3af044d4a62';
    
    if (!apiKey || !searchEngineId) {
      throw new Error('Google Custom Search API 키 또는 검색 엔진 ID가 설정되지 않았습니다.');
    }

    let retries = 0;
    while (retries < maxRetries) {
      try {
        // Rate Limiter 적용
        await this.googleRateLimiter.checkAndWait();
        
        console.log(`[GoogleSearch] 검색 중: ${query} (시도: ${retries + 1}/${maxRetries})`);
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: { key: apiKey, cx: searchEngineId, q: query, num: 10 }
        });
        return response.data;
      } catch (error: any) {
        console.error(`[GoogleSearch] API 호출 오류 (시도 ${retries + 1}):`, error.message);
        if (error.response && error.response.status === 429) {
          const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
          console.log(`[GoogleSearch] 요청 한도 초과. ${waitTime / 1000}초 후 재시도합니다...`);
          await this.sleep(waitTime);
          retries++;
        } else {
          throw error; // 재시도 불가능한 오류는 즉시 throw
        }
      }
    }
    throw new Error(`최대 재시도 횟수(${maxRetries})를 초과했습니다.`);
  }

  /**
   * 지정된 시간(ms) 동안 대기하는 유틸리티 함수
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
