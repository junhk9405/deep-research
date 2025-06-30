#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 간단한 디버깅 테스트 스크립트
"""

import asyncio
import os
import sys
import json

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def main():
    print("="*50)
    print("crawl4ai 간단한 디버깅 테스트")
    print("="*50)
    
    try:
        # 패키지 가져오기
        from crawl4ai import AsyncWebCrawler
        print("✅ crawl4ai 패키지 가져오기 성공!")
        
        # 패키지 버전 확인
        import crawl4ai
        print(f"crawl4ai 버전: {crawl4ai.__version__ if hasattr(crawl4ai, '__version__') else '알 수 없음'}")
        
        # URL 직접 크롤링 테스트
        print("\n1. URL 직접 크롤링 테스트:")
        async with AsyncWebCrawler() as crawler:
            url = "https://example.com"
            print(f"URL: {url} 크롤링 시작...")
            result = await crawler.arun(url=url, timeout_ms=10000)
            print(f"URL 크롤링 완료! 결과 타입: {type(result)}")
            
            # 결과 확인
            if hasattr(result, 'title'):
                print(f"제목: {result.title}")
            if hasattr(result, 'text') and result.text:
                print(f"텍스트 길이: {len(result.text)}")
                print(f"텍스트 일부: {result.text[:100]}...")
            
        # 검색 테스트
        print("\n2. 검색 테스트:")
        async with AsyncWebCrawler() as crawler:
            query = "Python programming"
            print(f"검색어: {query} 검색 시작...")
            try:
                search_results = await crawler.asearch(query=query, limit=3, timeout_ms=30000)
                print(f"검색 완료! 결과 수: {len(search_results) if search_results else 0}")
                
                # 검색 결과 확인
                if search_results and len(search_results) > 0:
                    for i, item in enumerate(search_results[:2]):
                        print(f"\n검색 결과 {i+1}:")
                        if hasattr(item, 'url'):
                            print(f"URL: {item.url}")
                        if hasattr(item, 'title'):
                            print(f"제목: {item.title}")
                else:
                    print("검색 결과가 없습니다.")
            except Exception as e:
                print(f"❌ 검색 중 오류 발생: {e}")
                import traceback
                traceback.print_exc()
        
        # 한글 검색 테스트
        print("\n3. 한글 검색 테스트:")
        async with AsyncWebCrawler() as crawler:
            query = "파이썬 프로그래밍"
            print(f"검색어: {query} 검색 시작...")
            try:
                search_results = await crawler.asearch(query=query, limit=3, timeout_ms=30000)
                print(f"검색 완료! 결과 수: {len(search_results) if search_results else 0}")
                
                # 검색 결과 확인
                if search_results and len(search_results) > 0:
                    for i, item in enumerate(search_results[:2]):
                        print(f"\n검색 결과 {i+1}:")
                        if hasattr(item, 'url'):
                            print(f"URL: {item.url}")
                        if hasattr(item, 'title'):
                            print(f"제목: {item.title}")
                else:
                    print("검색 결과가 없습니다.")
            except Exception as e:
                print(f"❌ 검색 중 오류 발생: {e}")
                import traceback
                traceback.print_exc()
                
    except Exception as e:
        print(f"❌ 테스트 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 간단한 디버깅 테스트 시작...\n")
    asyncio.run(main())
    print("\ncrawl4ai 간단한 디버깅 테스트 완료!")
