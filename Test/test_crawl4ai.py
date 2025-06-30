#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 패키지 기능 테스트 스크립트
"""

import asyncio
import os
import sys

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def test_crawl4ai():
    try:
        print("crawl4ai 패키지 가져오기 시도...")
        try:
            from crawl4ai import AsyncWebCrawler
            print("✅ crawl4ai 패키지 가져오기 성공!")
        except ImportError as e:
            print(f"❌ crawl4ai 패키지 가져오기 실패: {e}")
            print("'pip install crawl4ai' 명령으로 패키지를 설치해주세요.")
            return
        
        # 패키지 버전 확인
        try:
            import crawl4ai
            print(f"crawl4ai 버전: {crawl4ai.__version__}")
        except:
            print("crawl4ai 버전 확인 실패")
        
        # 크롤러 초기화 테스트
        print("\n크롤러 초기화 테스트...")
        try:
            crawler = AsyncWebCrawler()
            print("✅ 크롤러 초기화 성공!")
        except Exception as e:
            print(f"❌ 크롤러 초기화 실패: {e}")
            return
        
        # 간단한 URL 크롤링 테스트
        print("\nURL 크롤링 테스트...")
        test_url = "https://en.wikipedia.org/wiki/Artificial_intelligence"
        print(f"테스트 URL: {test_url}")
        
        try:
            async with AsyncWebCrawler() as crawler:
                result = await crawler.arun(
                    url=test_url,
                    timeout_ms=30000,
                )
            
            print("✅ URL 크롤링 성공!")
            print(f"결과 타입: {type(result)}")
            
            # 결과 내용 확인 (상세 디버깅)
            print("\n마크다운 객체 상세 분석:")
            if hasattr(result, 'markdown'):
                print(f"마크다운 객체 존재: {bool(result.markdown)}")
                print(f"마크다운 객체 타입: {type(result.markdown)}")
                
                # 마크다운 객체의 다양한 속성 확인
                try:
                    # 직접 문자열로 변환 시도
                    markdown_str = str(result.markdown)
                    print(f"마크다운 문자열 변환 결과 길이: {len(markdown_str)}")
                    if markdown_str:
                        print(f"마크다운 문자열 변환 내용 일부: {markdown_str[:200]}...")
                    
                    # 다양한 속성 접근 시도
                    if hasattr(result.markdown, 'raw_markdown'):
                        print(f"raw_markdown 속성 존재: {bool(result.markdown.raw_markdown)}")
                        if result.markdown.raw_markdown:
                            print(f"raw_markdown 내용 일부: {result.markdown.raw_markdown[:200]}...")
                    
                    if hasattr(result.markdown, 'markdown_with_citations'):
                        print(f"markdown_with_citations 속성 존재: {bool(result.markdown.markdown_with_citations)}")
                        if result.markdown.markdown_with_citations:
                            print(f"markdown_with_citations 내용 일부: {result.markdown.markdown_with_citations[:200]}...")
                    
                    if hasattr(result.markdown, 'fit_markdown'):
                        print(f"fit_markdown 속성 존재: {bool(result.markdown.fit_markdown)}")
                        if result.markdown.fit_markdown:
                            print(f"fit_markdown 내용 일부: {result.markdown.fit_markdown[:200]}...")
                    
                    # 기타 속성 탐색
                    for attr_name in dir(result.markdown):
                        if not attr_name.startswith('_') and not callable(getattr(result.markdown, attr_name)):
                            try:
                                attr_value = getattr(result.markdown, attr_name)
                                print(f"속성 {attr_name}: {type(attr_value)}")
                            except Exception as e:
                                print(f"속성 {attr_name} 접근 오류: {e}")
                    
                except Exception as e:
                    print(f"마크다운 속성 접근 오류: {e}")
            else:
                print("마크다운 객체가 없습니다.")
                
            # 텍스트 내용 확인
            print("\n텍스트 내용 확인:")
            if hasattr(result, 'text') and result.text:
                print(f"텍스트 내용 길이: {len(result.text)}")
                print(f"텍스트 내용 일부: {result.text[:200]}...")
            else:
                print("텍스트 내용이 없습니다.")
                
        except Exception as e:
            print(f"❌ URL 크롤링 실패: {e}")
            import traceback
            traceback.print_exc()
        
    except Exception as e:
        print(f"테스트 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 패키지 테스트 시작...\n")
    asyncio.run(test_crawl4ai())
    print("\ncrawl4ai 패키지 테스트 완료!")
