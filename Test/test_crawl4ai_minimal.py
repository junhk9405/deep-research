#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 최소 검색 테스트 스크립트
"""

import asyncio
import os
import sys
import traceback

# SSL 인증서 검증 비활성화
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def main():
    try:
        print("="*50)
        print("crawl4ai 최소 검색 테스트")
        print("="*50)
        
        # 패키지 가져오기
        from crawl4ai import AsyncWebCrawler
        print("✅ crawl4ai 패키지 가져오기 성공!")
        
        # 영어 검색어 테스트
        print("\n1. 영어 검색어 테스트:")
        async with AsyncWebCrawler() as crawler:
            try:
                query = "Python"
                print(f"검색어: '{query}' 검색 시작...")
                results = await crawler.asearch(query=query, limit=1, timeout_ms=20000)
                
                if results and len(results) > 0:
                    print(f"✅ 영어 검색 성공! 결과 수: {len(results)}")
                else:
                    print("❌ 영어 검색 실패! 결과가 없습니다.")
            except Exception as e:
                print(f"❌ 영어 검색 중 오류 발생: {str(e)}")
                traceback.print_exc()
        
        # 한글 검색어 테스트
        print("\n2. 한글 검색어 테스트:")
        async with AsyncWebCrawler() as crawler:
            try:
                query = "파이썬"
                print(f"검색어: '{query}' 검색 시작...")
                results = await crawler.asearch(query=query, limit=1, timeout_ms=20000)
                
                if results and len(results) > 0:
                    print(f"✅ 한글 검색 성공! 결과 수: {len(results)}")
                else:
                    print("❌ 한글 검색 실패! 결과가 없습니다.")
            except Exception as e:
                print(f"❌ 한글 검색 중 오류 발생: {str(e)}")
                traceback.print_exc()
        
        # URL 직접 크롤링 테스트
        print("\n3. URL 직접 크롤링 테스트:")
        async with AsyncWebCrawler() as crawler:
            try:
                url = "https://example.com"
                print(f"URL: '{url}' 크롤링 시작...")
                result = await crawler.arun(url=url, timeout_ms=20000)
                
                if result:
                    print(f"✅ URL 크롤링 성공!")
                    if hasattr(result, 'title'):
                        print(f"제목: {result.title}")
                    if hasattr(result, 'text') and result.text:
                        print(f"텍스트 길이: {len(result.text)}")
                else:
                    print("❌ URL 크롤링 실패!")
            except Exception as e:
                print(f"❌ URL 크롤링 중 오류 발생: {str(e)}")
                traceback.print_exc()
                
    except Exception as e:
        print(f"❌ 테스트 중 오류 발생: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 최소 검색 테스트 시작...\n")
    asyncio.run(main())
    print("\ncrawl4ai 최소 검색 테스트 완료!")
