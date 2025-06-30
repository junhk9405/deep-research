#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 최소 테스트 스크립트 - 간단한 HTML 페이지 테스트
"""

import asyncio
import os
import sys
import json

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def test_crawl4ai_mini():
    try:
        print("="*50)
        print("crawl4ai 최소 테스트")
        print("="*50)
        
        # 패키지 가져오기
        try:
            from crawl4ai import AsyncWebCrawler
            print("✅ crawl4ai 패키지 가져오기 성공!")
        except ImportError as e:
            print(f"❌ crawl4ai 패키지 가져오기 실패: {e}")
            return
        
        # 매우 간단한 HTML 페이지 크롤링
        print("\n간단한 HTML 페이지 크롤링 중...")
        url = "https://example.com"  # 매우 간단한 페이지
        
        async with AsyncWebCrawler() as crawler:
            print(f"URL: {url} 크롤링 시작...")
            result = await crawler.arun(
                url=url,
                timeout_ms=10000,  # 짧은 타임아웃
            )
            
            print(f"크롤링 완료! 결과 타입: {type(result)}")
            
            # 결과 확인
            print("\n기본 속성 확인:")
            for attr in ['title', 'text', 'html', 'markdown']:
                if hasattr(result, attr):
                    value = getattr(result, attr)
                    print(f"- {attr}: 존재={bool(value)}, 타입={type(value)}")
                    
                    # 문자열 변환 시도
                    try:
                        value_str = str(value)
                        print(f"  문자열 변환 길이: {len(value_str)}")
                        if value_str:
                            print(f"  내용 일부: {value_str[:100]}...")
                    except Exception as e:
                        print(f"  문자열 변환 오류: {e}")
                else:
                    print(f"- {attr}: 속성 없음")
            
            # 마크다운 객체 특별 처리
            if hasattr(result, 'markdown'):
                print("\n마크다운 객체 특별 처리:")
                md = result.markdown
                
                # 주요 속성 확인
                for md_attr in ['raw_markdown', 'markdown_with_citations', 'text']:
                    if hasattr(md, md_attr):
                        md_value = getattr(md, md_attr)
                        print(f"- {md_attr}: 존재={bool(md_value)}, 타입={type(md_value)}")
                        if md_value:
                            print(f"  내용 일부: {str(md_value)[:100]}...")
            
            # 결과 파일 저장
            try:
                result_dict = {
                    'url': url,
                    'title': getattr(result, 'title', ''),
                    'text': getattr(result, 'text', ''),
                }
                
                # 마크다운 처리
                if hasattr(result, 'markdown'):
                    md = result.markdown
                    if hasattr(md, 'raw_markdown') and md.raw_markdown:
                        result_dict['markdown'] = md.raw_markdown
                    elif hasattr(md, 'markdown_with_citations') and md.markdown_with_citations:
                        result_dict['markdown'] = md.markdown_with_citations
                    else:
                        result_dict['markdown'] = str(md)
                
                # 파일 저장
                with open('crawl4ai_mini_result.json', 'w', encoding='utf-8') as f:
                    json.dump(result_dict, f, ensure_ascii=False, indent=2)
                print("\n결과를 crawl4ai_mini_result.json 파일로 저장했습니다.")
            except Exception as e:
                print(f"\n결과 저장 오류: {e}")
                
    except Exception as e:
        print(f"테스트 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 최소 테스트 시작...\n")
    asyncio.run(test_crawl4ai_mini())
    print("\ncrawl4ai 최소 테스트 완료!")
