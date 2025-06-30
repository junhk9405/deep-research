#!/usr/bin/env python
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

async def crawl_with_retry(crawler, url, timeout, retries=3, delay=5):
    """Crawl a single URL with retry logic."""
    last_exception = None
    for attempt in range(retries):
        try:
            print(f"[crawl4ai] 크롤링 시도 {attempt + 1}/{retries}: {url}")
            result = await crawler.arun(url=url, timeout_ms=timeout)
            print(f"[crawl4ai] 크롤링 성공: {url}")
            return result
        except Exception as e:
            last_exception = e
            print(f"[crawl4ai] 시도 {attempt + 1} 실패: {url}, 오류: {type(e).__name__}. {delay}초 후 재시도합니다.", file=sys.stderr)
            if attempt < retries - 1:
                await asyncio.sleep(delay)
    # All retries failed, raise the last exception
    print(f"[crawl4ai] 모든 재시도 실패: {url}", file=sys.stderr)
    if last_exception:
        raise last_exception

async def main():
    # 명령줄 인자 파싱
    parser = argparse.ArgumentParser(description='crawl4ai를 사용한 웹 크롤링')
    parser.add_argument('--query', required=True, help='검색 쿼리')
    parser.add_argument('--urls', action='append', help='크롤링할 URL')
    parser.add_argument('--timeout', type=int, default=60000, help='타임아웃(ms)')
    parser.add_argument('--limit', type=int, default=10, help='결과 제한 수') # 현재 스크립트에서 직접 사용되진 않음
    parser.add_argument('--max-tokens', type=int, default=100000, help='최대 토큰 수 (마크다운 내용 길이 제한)')
    parser.add_argument('--output', required=True, help='결과 출력 파일 경로')
    parser.add_argument('--concurrency', type=int, default=5, help='동시 크롤링 작업 수')
    
    args = parser.parse_args()
    
    semaphore = asyncio.Semaphore(args.concurrency)

    async def crawl_with_semaphore(crawler, url, timeout):
        async with semaphore:
            return await crawl_with_retry(crawler, url, timeout)

    try:
        print(f"[crawl4ai] 검색 쿼리: {args.query}")
        if not args.urls:
            print("[crawl4ai] 크롤링할 URL이 없습니다. 빈 결과를 저장합니다.")
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump([], f)
            sys.exit(0)
            
        print(f"[crawl4ai] 크롤링 URL 목록: {args.urls}")
        print(f"[crawl4ai] 동시 작업 수: {args.concurrency}, 타임아웃: {args.timeout}ms, 최대 토큰: {args.max_tokens}")
        start_time = time.time()
        
        output_results = []
        # AsyncWebCrawler는 한 번만 생성하여 재사용합니다.
        # 내부적으로 Playwright 컨텍스트 등을 관리하므로, 매번 생성/종료하는 것보다 효율적입니다.
        async with AsyncWebCrawler() as crawler:
            print("[crawl4ai] 크롤링 태스크 생성 중...")
            tasks = [crawl_with_semaphore(crawler, url, args.timeout) for url in args.urls]
            print(f"[crawl4ai] asyncio.gather로 병렬 크롤링 시작 (최대 동시성: {args.concurrency})...")
            # return_exceptions=True를 통해 개별 작업의 예외를 잡아낼 수 있습니다.
            results = await asyncio.gather(*tasks, return_exceptions=True)
            print("[crawl4ai] 병렬 크롤링 완료. 결과 처리 시작...")

            for i, result_or_exception in enumerate(results):
                url = args.urls[i]
                current_result = {}
                current_result['url'] = url
                current_result['markdown'] = None
                current_result['error'] = None
                
                print(f"[crawl4ai] 결과 처리 중: {url}")
                if isinstance(result_or_exception, Exception):
                    error_message = f"{type(result_or_exception).__name__}: {str(result_or_exception)}"
                    print(f"[crawl4ai] 최종 크롤링 실패 {url}: {error_message}", file=sys.stderr)
                    current_result['error'] = error_message
                elif result_or_exception and hasattr(result_or_exception, 'markdown') and result_or_exception.markdown:
                    markdown_content = result_or_exception.markdown
                    if args.max_tokens > 0 and len(markdown_content) > args.max_tokens:
                        print(f"[crawl4ai] 내용 길이 제한: {url}의 마크다운을 {args.max_tokens}자로 자릅니다.")
                        markdown_content = markdown_content[:args.max_tokens]
                    current_result['markdown'] = markdown_content
                    print(f"[crawl4ai] 성공 결과 추가: {url} (내용 길이: {len(markdown_content)})")
                else:
                    no_content_message = "크롤링 성공했으나 내용 없음 또는 markdown 속성 누락"
                    print(f"[crawl4ai] {no_content_message}: {url}")
                    current_result['error'] = no_content_message 
                
                output_results.append(current_result)
        
        # 결과 파일 저장
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(output_results, f, ensure_ascii=False, indent=2)
        
        end_time = time.time()
        successful_crawls = sum(1 for r in output_results if r['markdown'] is not None and r['error'] is None)
        failed_crawls = len(output_results) - successful_crawls
        print(f"[crawl4ai] 검색 완료: 총 {len(output_results)}개 URL 처리 (성공: {successful_crawls}, 실패: {failed_crawls}), 소요 시간: {end_time - start_time:.2f}초")
        
    except Exception as e:
        # 이 예외는 main 함수의 로직 자체에서 발생하는 예외 (예: 파일 쓰기 권한 없음 등)
        print(f"[crawl4ai] 스크립트 실행 중 심각한 오류 발생: {type(e).__name__} - {str(e)}", file=sys.stderr)
        # 오류 발생 시에도 output 파일에는 빈 리스트 또는 부분 결과를 기록하려고 시도할 수 있으나,
        # 여기서는 일관성을 위해 빈 리스트를 저장합니다.
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump([], f)
        except Exception as e_file:
            print(f"[crawl4ai] 오류 상황에서 결과 파일 저장 실패: {str(e_file)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
