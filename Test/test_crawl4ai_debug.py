#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 디버깅 테스트 스크립트 - 검색 및 크롤링 기능 상세 디버깅
"""

import asyncio
import os
import sys
import json
import traceback
import time

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

async def test_crawl4ai_debug():
    try:
        print("="*50)
        print("crawl4ai 디버깅 테스트")
        print("="*50)
        
        # 패키지 가져오기
        try:
            from crawl4ai import AsyncWebCrawler
            print("✅ crawl4ai 패키지 가져오기 성공!")
            
            # 패키지 버전 확인
            import crawl4ai
            print(f"crawl4ai 버전: {crawl4ai.__version__}")
        except ImportError as e:
            print(f"❌ crawl4ai 패키지 가져오기 실패: {e}")
            return
        except Exception as e:
            print(f"❌ crawl4ai 패키지 확인 중 오류: {e}")
            return
        
        # 테스트 케이스 정의
        test_cases = [
            {
                "name": "간단한 URL 직접 크롤링",
                "is_url": True,
                "query": "https://example.com",
                "timeout_ms": 10000
            },
            {
                "name": "영어 검색어 크롤링",
                "is_url": False,
                "query": "Python programming language",
                "timeout_ms": 30000
            },
            {
                "name": "한글 검색어 크롤링",
                "is_url": False,
                "query": "파이썬 프로그래밍 언어",
                "timeout_ms": 30000
            }
        ]
        
        # 각 테스트 케이스 실행
        for test_case in test_cases:
            print("\n" + "="*30)
            print(f"테스트: {test_case['name']}")
            print("="*30)
            
            try:
                # 크롤러 초기화 및 실행
                print(f"크롤링 시작: {test_case['query']}")
                start_time = time.time()
                
                async with AsyncWebCrawler() as crawler:
                    # 크롤러 내부 객체 확인
                    print(f"크롤러 객체: {crawler}")
                    print(f"크롤러 타입: {type(crawler)}")
                    
                    if test_case['is_url']:
                        # URL 직접 크롤링
                        print(f"URL 직접 크롤링: {test_case['query']}")
                        result = await crawler.arun(
                            url=test_case['query'],
                            timeout_ms=test_case['timeout_ms'],
                        )
                    else:
                        # 검색어 기반 크롤링
                        print(f"검색어 기반 크롤링: {test_case['query']}")
                        try:
                            # 검색 메서드 확인
                            print("검색 메서드 호출 직전")
                            result = await crawler.asearch(
                                query=test_case['query'],
                                timeout_ms=test_case['timeout_ms'],
                                limit=5,
                            )
                            print("검색 메서드 호출 직후")
                        except Exception as e:
                            print(f"❌ 검색 메서드 호출 오류: {e}")
                            traceback.print_exc()
                            continue
                    
                    # 실행 시간 측정
                    elapsed_time = time.time() - start_time
                    print(f"크롤링 완료! 소요 시간: {elapsed_time:.2f}초")
                    
                    # 결과 확인
                    print(f"결과 타입: {type(result)}")
                    
                    # 결과가 리스트인 경우 (검색 결과)
                    if isinstance(result, list):
                        print(f"검색 결과 수: {len(result)}")
                        for i, item in enumerate(result[:3]):  # 처음 3개만 표시
                            print(f"\n결과 {i+1}:")
                            for attr in ['url', 'title', 'text', 'markdown']:
                                if hasattr(item, attr):
                                    value = getattr(item, attr)
                                    print(f"- {attr}: 존재={bool(value)}, 타입={type(value)}")
                                    
                                    # 문자열 변환 시도
                                    try:
                                        value_str = str(value)
                                        if value_str:
                                            print(f"  내용 일부: {value_str[:100]}...")
                                    except Exception as e:
                                        print(f"  문자열 변환 오류: {e}")
                    # 단일 결과인 경우 (URL 직접 크롤링)
                    else:
                        print("\n기본 속성 확인:")
                        for attr in ['url', 'title', 'text', 'html', 'markdown']:
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
                        # 파일명 생성
                        filename = f"crawl4ai_debug_{test_case['name'].replace(' ', '_')}.json"
                        
                        # 결과 변환
                        if isinstance(result, list):
                            # 검색 결과 리스트
                            result_list = []
                            for item in result:
                                item_dict = {
                                    'url': getattr(item, 'url', ''),
                                    'title': getattr(item, 'title', ''),
                                    'text': getattr(item, 'text', ''),
                                }
                                
                                # 마크다운 처리
                                if hasattr(item, 'markdown'):
                                    md = item.markdown
                                    if hasattr(md, 'raw_markdown') and md.raw_markdown:
                                        item_dict['markdown'] = md.raw_markdown
                                    elif hasattr(md, 'markdown_with_citations') and md.markdown_with_citations:
                                        item_dict['markdown'] = md.markdown_with_citations
                                    else:
                                        item_dict['markdown'] = str(md)
                                
                                result_list.append(item_dict)
                            
                            # 파일 저장
                            with open(filename, 'w', encoding='utf-8') as f:
                                json.dump(result_list, f, ensure_ascii=False, indent=2)
                        else:
                            # 단일 결과
                            result_dict = {
                                'url': getattr(result, 'url', ''),
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
                            with open(filename, 'w', encoding='utf-8') as f:
                                json.dump(result_dict, f, ensure_ascii=False, indent=2)
                        
                        print(f"\n결과를 {filename} 파일로 저장했습니다.")
                    except Exception as e:
                        print(f"\n결과 저장 오류: {e}")
                        traceback.print_exc()
            
            except Exception as e:
                print(f"❌ 테스트 케이스 실행 중 오류: {e}")
                traceback.print_exc()
                
    except Exception as e:
        print(f"테스트 중 오류 발생: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 디버깅 테스트 시작...\n")
    asyncio.run(test_crawl4ai_debug())
    print("\ncrawl4ai 디버깅 테스트 완료!")
