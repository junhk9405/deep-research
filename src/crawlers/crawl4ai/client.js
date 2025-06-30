/**
 * crawl4ai 크롤러 구현체
 * Node.js에서 Python 프로세스를 실행하여 crawl4ai를 호출
 */
import axios from 'axios';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
export class Crawl4aiCrawler {
    pythonPath;
    scriptPath;
    constructor() {
        // Python 실행 경로 (환경 변수에서 가져오거나 기본값 사용)
        // 명시적인 경로 지정 (Windows 환경)
        this.pythonPath = process.env.PYTHON_PATH || 'C:\\Users\\user\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
        console.log(`[Crawl4AI] Python 실행 경로: ${this.pythonPath}`);
        // crawl4ai 스크립트 경로 생성 및 저장
        this.scriptPath = this.createCrawl4aiScript();
    }
    /**
     * 웹 검색 수행
     * @param query 검색 쿼리
     * @param options 검색 옵션
     * @returns 검색 결과
     */
    /**
     * 지정된 시간(ms) 동안 대기하는 유틸리티 함수
     */
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Google Custom Search API 호출 함수 (재시도 로직 포함)
     */
    async fetchGoogleSearchResults(query, maxRetries = 3) {
        // Google Custom Search API 키와 검색 엔진 ID 설정
        // 환경 변수에서 가져오거나 하드코딩된 값 사용
        const apiKey = process.env.GOOGLE_SEARCH_API_KEY || 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
        const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '33616c3af044d4a62';
        if (!apiKey || !searchEngineId) {
            throw new Error('Google Custom Search API 키 또는 검색 엔진 ID가 설정되지 않았습니다.');
        }
        let retries = 0;
        let lastError = null;
        while (retries <= maxRetries) {
            try {
                console.log(`[GoogleSearch] 검색 중: ${query} (시도: ${retries + 1}/${maxRetries + 1})`);
                const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
                    params: {
                        key: apiKey,
                        cx: searchEngineId,
                        q: query,
                        num: 10 // 가져올 결과 수, 필요에 따라 조절
                    }
                });
                return response.data;
            }
            catch (error) {
                lastError = error;
                // 429 오류(Too Many Requests) 처리
                if (error.response && error.response.status === 429) {
                    const resetTime = error.response.headers['x-ratelimit-reset'];
                    let waitTime = 1000; // 기본 1초 대기
                    if (resetTime) {
                        // x-ratelimit-reset 헤더에서 대기 시간 추출 (초 단위)
                        const resetValues = resetTime.split(',');
                        if (resetValues.length > 0 && !isNaN(resetValues[0])) {
                            waitTime = parseInt(resetValues[0]) * 1000; // 밀리초로 변환
                        }
                    }
                    // 지수 백오프 전략 적용 (재시도마다 대기 시간 증가)
                    waitTime = waitTime * Math.pow(2, retries);
                    console.log(`[GoogleSearch] 요청 한도 초과. ${waitTime / 1000}초 후 재시도합니다...`);
                    await this.sleep(waitTime);
                    retries++;
                    continue;
                }
                // 인증서 오류 처리
                if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
                    error.code === 'SELF_SIGNED_CERT_IN_CHAIN' ||
                    error.code === 'CERT_HAS_EXPIRED') {
                    console.error(`[GoogleSearch] SSL 인증서 오류: ${error.code}. 사내망 환경에서는 NODE_TLS_REJECT_UNAUTHORIZED=0 환경변수 설정이 필요할 수 있습니다.`);
                }
                // 그 외 오류는 바로 실패 처리
                throw error;
            }
        }
        // 최대 재시도 횟수 초과 시 마지막 오류 throw
        throw lastError;
    }
    async search(query, options) {
        try {
            // 검색 옵션 준비
            const timeout = options?.timeout || 30000;
            const limit = options?.limit || 10;
            const maxTokens = options?.scrapeOptions?.maxTokens || 100000;
            // 임시 결과 파일 경로
            const outputFilePath = path.join(os.tmpdir(), `crawl4ai_result_${Date.now()}.json`);
            try {
                // 재시도 로직이 포함된 Google Custom Search API 호출
                const searchData = await this.fetchGoogleSearchResults(query, 3);
                // Google Custom Search API 결과에서 URL 추출
                const urls = searchData.items?.map((item) => item.link) || [];
                if (urls.length === 0) {
                    console.log('[GoogleSearch] 검색 결과에서 URL을 찾을 수 없습니다.');
                    // 결과가 없을 경우 빈 파일을 생성
                    fs.writeFileSync(outputFilePath, JSON.stringify([], null, 2));
                    return { data: [] };
                }
                console.log(`[GoogleSearch] ${urls.length}개의 URL을 찾았습니다. 크롤링을 시작합니다...`);
                // URL 목록을 인자로 전달하여 crawl4ai 스크립트 실행
                const urlsString = urls.join(' ');
                const args = [
                    this.scriptPath,
                    '--urls', urlsString,
                    '--output', outputFilePath,
                    '--timeout', timeout.toString(),
                    '--limit', limit.toString(),
                    '--max-tokens', maxTokens.toString()
                ];
                console.log(`[Crawl4AI] 명령어: ${this.pythonPath} ${args.join(' ')}`);
                // Python 프로세스 실행
                const result = await this.runPythonProcess(args);
                // 결과 파일 읽기
                if (fs.existsSync(outputFilePath)) {
                    const resultData = fs.readFileSync(outputFilePath, 'utf-8');
                    const parsedResult = JSON.parse(resultData);
                    // 임시 파일 삭제
                    fs.unlinkSync(outputFilePath);
                    // Firecrawl 형식으로 변환하여 반환
                    return this.convertToFirecrawlFormat(parsedResult);
                }
                else {
                    throw new Error('결과 파일을 찾을 수 없습니다.');
                }
            }
            catch (error) {
                console.error('[GoogleSearch] 검색 결과 가져오기 오류:', error);
                throw error;
            }
        }
        catch (error) {
            console.error('Error in crawl4ai search:', error);
            // 오류 발생 시 빈 결과 반환
            return { data: [] };
        }
    }
    /**
     * Python 프로세스 실행
     * @param args 명령줄 인자
     * @returns 프로세스 실행 결과
     */
    runPythonProcess(args) {
        return new Promise((resolve, reject) => {
            const process = spawn(this.pythonPath, args);
            let stdout = '';
            let stderr = '';
            process.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log(`[Crawl4AI 출력] ${data.toString().trim()}`);
            });
            process.stderr.on('data', (data) => {
                stderr += data.toString();
                console.error(`[Crawl4AI 오류] ${data.toString().trim()}`);
            });
            process.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout);
                }
                else {
                    reject(new Error(`Python 프로세스 실패 (코드: ${code}): ${stderr}`));
                }
            });
        });
    }
    /**
     * crawl4ai 결과를 Firecrawl 형식으로 변환
     * @param result crawl4ai 결과
     * @returns Firecrawl 형식 결과
     */
    convertToFirecrawlFormat(result) {
        const items = Array.isArray(result) ? result : (result.results || []);
        return {
            data: items.map((item) => {
                let markdown = '';
                // markdown 속성이 객체인 경우 처리
                if (item.markdown && typeof item.markdown === 'object') {
                    // 다양한 마크다운 속성 접근 시도
                    markdown = item.markdown.raw_markdown ||
                        item.markdown.markdown_with_citations ||
                        item.markdown.text ||
                        String(item.markdown) || '';
                    console.log(`[crawl4ai] 마크다운 객체 변환: ${markdown.substring(0, 100)}...`);
                }
                else {
                    markdown = item.markdown || item.content || '';
                }
                return {
                    url: item.url || '',
                    markdown: markdown,
                    // 기타 필요한 필드들...
                };
            })
        };
    }
    /**
     * crawl4ai 실행 스크립트 생성
     * @returns 스크립트 파일 경로
     */
    createCrawl4aiScript() {
        const scriptDir = path.join(__dirname, 'scripts');
        const scriptPath = path.join(scriptDir, 'run_crawl4ai.py');
        // 스크립트 디렉토리가 없으면 생성
        if (!fs.existsSync(scriptDir)) {
            fs.mkdirSync(scriptDir, { recursive: true });
        }
        // 스크립트 파일이 없으면 생성
        if (!fs.existsSync(scriptPath)) {
            const scriptContent = `#!/usr/bin/env python
# -*- coding: utf-8 -*-

import asyncio
import argparse
import json
import sys
import time

try:
    from crawl4ai import AsyncWebCrawler
except ImportError:
    print("crawl4ai 패키지가 설치되어 있지 않습니다. 'pip install crawl4ai' 명령으로 설치해주세요.")
    sys.exit(1)

async def main():
    # 명령줄 인자 파싱
    parser = argparse.ArgumentParser(description='crawl4ai를 사용한 웹 크롤링')
    parser.add_argument('--query', required=True, help='검색 쿼리 또는 URL')
    parser.add_argument('--timeout', type=int, default=30000, help='타임아웃(ms)')
    parser.add_argument('--limit', type=int, default=10, help='결과 제한 수')
    parser.add_argument('--max-tokens', type=int, default=100000, help='최대 토큰 수')
    parser.add_argument('--output', required=True, help='결과 출력 파일 경로')
    
    args = parser.parse_args()
    
    try:
        print(f"[crawl4ai] 검색 시작: {args.query}")
        start_time = time.time()
        
        # crawl4ai 실행
        async with AsyncWebCrawler() as crawler:
            # URL인 경우 직접 크롤링, 아닌 경우 검색어로 간주
            is_url = args.query.startswith('http://') or args.query.startswith('https://')
            
            if is_url:
                # URL 직접 크롤링
                result = await crawler.arun(
                    url=args.query,
                    timeout_ms=args.timeout,
                )
                results = [result]
            else:
                # 검색어로 여러 URL 검색 (실제로는 검색 기능이 제한적일 수 있음)
                # 여기서는 간단한 예시로 구현
                # 실제 구현에서는 적절한 검색 API 사용 필요
                print(f"[crawl4ai] 경고: 검색어 기반 검색은 제한적일 수 있습니다.")
                # 임시 결과
                results = []
            
        # 결과 형식 변환
        output_results = []
        for result in results:
            if hasattr(result, 'markdown') and result.markdown:
                # markdown 속성의 raw_markdown 또는 markdown_with_citations 사용
                markdown_content = ''
                try:
                    if hasattr(result.markdown, 'raw_markdown'):
                        markdown_content = result.markdown.raw_markdown
                        print(f"[crawl4ai] raw_markdown 사용: {len(markdown_content)} 문자")
                    elif hasattr(result.markdown, 'markdown_with_citations'):
                        markdown_content = result.markdown.markdown_with_citations
                        print(f"[crawl4ai] markdown_with_citations 사용: {len(markdown_content)} 문자")
                    else:
                        # 직접 문자열로 변환 시도
                        markdown_content = str(result.markdown)
                        print(f"[crawl4ai] 문자열 변환 사용: {len(markdown_content)} 문자")
                except Exception as e:
                    print(f"[crawl4ai] 마크다운 추출 오류: {str(e)}")
                    markdown_content = str(result.markdown)
                
                output_results.append({
                    'url': args.query if is_url else '',
                    'markdown': markdown_content,
                })
        
        # 결과 파일 저장
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(output_results, f, ensure_ascii=False, indent=2)
        
        end_time = time.time()
        print(f"[crawl4ai] 검색 완료: {len(output_results)}개 결과, 소요 시간: {end_time - start_time:.2f}초")
        
    except Exception as e:
        print(f"[crawl4ai] 오류 발생: {str(e)}", file=sys.stderr)
        # 오류 시 빈 결과 저장
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump([], f)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
`;
            fs.writeFileSync(scriptPath, scriptContent);
        }
        return scriptPath;
    }
}
