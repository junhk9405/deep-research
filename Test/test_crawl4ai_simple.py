#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 간단 테스트 스크립트 (위키피디아 페이지)
"""

import asyncio
import os
import sys

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def test_crawl4ai_simple():
    try:
        print("="*50)
        print("crawl4ai 간단 테스트 (위키피디아)")
        print("="*50)
        
        # 패키지 가져오기
        try:
            from crawl4ai import AsyncWebCrawler
            print("✅ crawl4ai 패키지 가져오기 성공!")
        except ImportError as e:
            print(f"❌ crawl4ai 패키지 가져오기 실패: {e}")
            return
        
        # 간단한 위키피디아 페이지 크롤링
        print("위키피디아 페이지 크롤링 중...")
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(
                url="https://en.wikipedia.org/wiki/Python_(programming_language)",
                timeout_ms=20000,
            )
            
            print(f"결과 타입: {type(result)}")
            print("="*50)
            
            # 결과의 주요 속성 출력
            print("결과 객체의 주요 속성:")
            attrs_to_check = ['markdown', 'text', 'html', 'title']
            for attr in attrs_to_check:
                if hasattr(result, attr):
                    value = getattr(result, attr)
                    print(f"- {attr}: 타입={type(value)}, 값 존재={bool(value)}")
                    
                    if attr == 'markdown':
                        print("  [마크다운 객체 상세 분석]")
                        try:
                            # 문자열 변환 시도
                            markdown_str = str(value)
                            print(f"  - 문자열 변환 결과: 길이={len(markdown_str)}")
                            if markdown_str:
                                print(f"    내용 일부: {markdown_str[:100]}...")
                            
                            # 마크다운 객체 속성 탐색
                            if hasattr(value, 'raw_markdown'):
                                print(f"  - raw_markdown: 값 존재={bool(value.raw_markdown)}, 타입={type(value.raw_markdown)}")
                                if value.raw_markdown:
                                    print(f"    내용 일부: {value.raw_markdown[:100]}...")
                            
                            if hasattr(value, 'markdown_with_citations'):
                                print(f"  - markdown_with_citations: 값 존재={bool(value.markdown_with_citations)}, 타입={type(value.markdown_with_citations)}")
                                if value.markdown_with_citations:
                                    print(f"    내용 일부: {value.markdown_with_citations[:100]}...")
                            
                            # 기타 속성 탐색
                            print("  - 기타 속성:")
                            for md_attr in dir(value):
                                if not md_attr.startswith('_') and not callable(getattr(value, md_attr)) and md_attr not in ['raw_markdown', 'markdown_with_citations']:
                                    try:
                                        md_val = getattr(value, md_attr)
                                        print(f"    * {md_attr}: 타입={type(md_val)}, 값 존재={bool(md_val)}")
                                    except Exception as e:
                                        print(f"    * {md_attr}: 접근 오류 - {e}")
                        except Exception as e:
                            print(f"  - 마크다운 속성 접근 오류: {e}")
                    
                    elif attr in ['text', 'html', 'title'] and value:
                        val_str = str(value)
                        print(f"  - 길이: {len(val_str)}")
                        print(f"  - 내용 일부: {val_str[:100]}...")
                else:
                    print(f"- {attr}: 속성 없음")
            
    except Exception as e:
        print(f"테스트 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 간단 테스트 시작...\n")
    asyncio.run(test_crawl4ai_simple())
    print("\ncrawl4ai 간단 테스트 완료!")
