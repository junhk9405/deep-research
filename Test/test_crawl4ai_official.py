#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 공식 예제 테스트 스크립트
"""

import asyncio
import os
import sys

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def test_crawl4ai_official():
    try:
        print("="*50)
        print("crawl4ai 공식 예제 테스트")
        print("="*50)
        
        # 패키지 가져오기
        try:
            from crawl4ai import AsyncWebCrawler
            print("✅ crawl4ai 패키지 가져오기 성공!")
        except ImportError as e:
            print(f"❌ crawl4ai 패키지 가져오기 실패: {e}")
            return
        
        # 공식 예제 실행
        print("공식 예제 실행 중...")
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(
                url="https://www.nbcnews.com/business",
                timeout_ms=30000,
            )
            
            print(f"결과 타입: {type(result)}")
            print("="*50)
            
            # 결과의 모든 속성 출력
            print("결과 객체의 모든 속성:")
            for attr in dir(result):
                if not attr.startswith('_'):  # 내부 속성 제외
                    try:
                        value = getattr(result, attr)
                        if not callable(value):  # 메서드 제외
                            print(f"- {attr}: {type(value)}")
                            if attr == 'markdown' and value:
                                print(f"  마크다운 내용 일부: {value[:200]}...")
                            elif attr == 'text' and value:
                                print(f"  텍스트 내용 일부: {value[:200]}...")
                    except Exception as e:
                        print(f"- {attr}: 접근 오류 - {e}")
            
            print("="*50)
            print("마크다운 객체 상세 분석:")
            if hasattr(result, 'markdown') and result.markdown:
                print(f"마크다운 객체 타입: {type(result.markdown)}")
                
                # 다양한 속성 접근 시도
                try:
                    if hasattr(result.markdown, 'raw_markdown'):
                        print(f"raw_markdown 존재: {bool(result.markdown.raw_markdown)}")
                        if result.markdown.raw_markdown:
                            print(f"raw_markdown 내용 일부: {result.markdown.raw_markdown[:200]}...")
                    
                    if hasattr(result.markdown, 'markdown_with_citations'):
                        print(f"markdown_with_citations 존재: {bool(result.markdown.markdown_with_citations)}")
                        if result.markdown.markdown_with_citations:
                            print(f"markdown_with_citations 내용 일부: {result.markdown.markdown_with_citations[:200]}...")
                    
                    if hasattr(result.markdown, 'fit_markdown'):
                        print(f"fit_markdown 존재: {bool(result.markdown.fit_markdown)}")
                        if result.markdown.fit_markdown:
                            print(f"fit_markdown 내용 일부: {result.markdown.fit_markdown[:200]}...")
                    
                    # 문자열 변환 시도
                    markdown_str = str(result.markdown)
                    print(f"문자열 변환 결과 길이: {len(markdown_str)}")
                    if markdown_str:
                        print(f"문자열 변환 내용 일부: {markdown_str[:200]}...")
                except Exception as e:
                    print(f"마크다운 속성 접근 오류: {e}")
            else:
                print("마크다운 내용이 없습니다.")
                
            # 원본 마크다운 출력 (기존 코드와 동일)
            print("="*50)
            print("원본 마크다운 출력:")
            print(result.markdown if hasattr(result, 'markdown') and result.markdown else "마크다운 내용이 없습니다.")
            
    except Exception as e:
        print(f"테스트 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 공식 예제 테스트 시작...\n")
    asyncio.run(test_crawl4ai_official())
    print("\ncrawl4ai 공식 예제 테스트 완료!")
