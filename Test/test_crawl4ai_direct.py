#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 직접 테스트 스크립트 - 마크다운 추출 기능 검증
"""

import asyncio
import os
import sys
import json

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def test_crawl4ai_direct():
    try:
        print("="*50)
        print("crawl4ai 직접 테스트 - 마크다운 추출 기능")
        print("="*50)
        
        # 패키지 가져오기
        try:
            from crawl4ai import AsyncWebCrawler
            from crawl4ai.markdown_generator import DefaultMarkdownGenerator
            print("✅ crawl4ai 패키지 가져오기 성공!")
        except ImportError as e:
            print(f"❌ crawl4ai 패키지 가져오기 실패: {e}")
            return
        
        # 간단한 위키피디아 페이지 크롤링
        print("\n간단한 위키피디아 페이지 크롤링 중...")
        async with AsyncWebCrawler() as crawler:
            url = "https://en.wikipedia.org/wiki/Python_(programming_language)"
            result = await crawler.arun(
                url=url,
                timeout_ms=30000,
            )
            
            print(f"결과 타입: {type(result)}")
            print("="*50)
            
            # 마크다운 객체 상세 분석
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
                            print(f"raw_markdown 내용 길이: {len(result.markdown.raw_markdown)}")
                            print(f"raw_markdown 내용 일부: {result.markdown.raw_markdown[:200]}...")
                    
                    if hasattr(result.markdown, 'markdown_with_citations'):
                        print(f"markdown_with_citations 속성 존재: {bool(result.markdown.markdown_with_citations)}")
                        if result.markdown.markdown_with_citations:
                            print(f"markdown_with_citations 내용 길이: {len(result.markdown.markdown_with_citations)}")
                            print(f"markdown_with_citations 내용 일부: {result.markdown.markdown_with_citations[:200]}...")
                    
                    # 기타 속성 탐색
                    print("\n기타 속성:")
                    for attr_name in dir(result.markdown):
                        if not attr_name.startswith('_') and not callable(getattr(result.markdown, attr_name)):
                            try:
                                attr_value = getattr(result.markdown, attr_name)
                                print(f"속성 {attr_name}: 타입={type(attr_value)}, 값 존재={bool(attr_value)}")
                                if attr_value and isinstance(attr_value, str) and len(attr_value) > 0:
                                    print(f"  내용 길이: {len(attr_value)}")
                                    print(f"  내용 일부: {attr_value[:100]}...")
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
            
            # JSON 직렬화 테스트
            print("\nJSON 직렬화 테스트:")
            try:
                # 결과 객체를 딕셔너리로 변환
                result_dict = {
                    'url': url,
                    'title': getattr(result, 'title', ''),
                    'text': getattr(result, 'text', ''),
                }
                
                # 마크다운 객체 처리
                if hasattr(result, 'markdown'):
                    if hasattr(result.markdown, 'raw_markdown'):
                        result_dict['markdown'] = result.markdown.raw_markdown
                    elif hasattr(result.markdown, 'markdown_with_citations'):
                        result_dict['markdown'] = result.markdown.markdown_with_citations
                    else:
                        result_dict['markdown'] = str(result.markdown)
                
                # JSON 직렬화
                json_result = json.dumps(result_dict, ensure_ascii=False, indent=2)
                print(f"JSON 직렬화 성공! 길이: {len(json_result)}")
                print(f"JSON 내용 일부: {json_result[:200]}...")
                
                # 파일로 저장
                with open('crawl4ai_result.json', 'w', encoding='utf-8') as f:
                    f.write(json_result)
                print("결과를 crawl4ai_result.json 파일로 저장했습니다.")
                
            except Exception as e:
                print(f"JSON 직렬화 오류: {e}")
                import traceback
                traceback.print_exc()
            
    except Exception as e:
        print(f"테스트 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 직접 테스트 시작...\n")
    asyncio.run(test_crawl4ai_direct())
    print("\ncrawl4ai 직접 테스트 완료!")
