#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
crawl4ai 검색어 유형별 테스트 스크립트
- 한글 검색어
- 영어 검색어
- 복잡한 쿼리
- 짧은 쿼리
- 특수문자 포함 쿼리
"""

import asyncio
import os
import sys
import json
import traceback
import time

# SSL 인증서 검증 비활성화 (사내망 환경에서 필요)
os.environ['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

# 검색어 테스트 함수
async def test_search_query(crawler, query, timeout_ms=15000):
    print(f"\n[테스트] 검색어: '{query}'")
    print("-" * 40)
    
    start_time = time.time()
    try:
        # 검색 실행
        print(f"검색 시작...")
        results = await crawler.asearch(query=query, limit=2, timeout_ms=timeout_ms)
        elapsed_time = time.time() - start_time
        
        # 결과 확인
        if results and len(results) > 0:
            print(f"✅ 검색 성공! 결과 수: {len(results)}, 소요 시간: {elapsed_time:.2f}초")
            
            # 첫 번째 결과만 상세 출력
            if len(results) > 0:
                item = results[0]
                print(f"  첫 번째 결과:")
                print(f"  - URL: {getattr(item, 'url', 'N/A')}")
                print(f"  - 제목: {getattr(item, 'title', 'N/A')}")
                
                # 텍스트 확인
                if hasattr(item, 'text') and item.text:
                    print(f"  - 텍스트 길이: {len(item.text)}")
                    print(f"  - 텍스트 일부: {item.text[:50]}...")
                else:
                    print("  - 텍스트: 없음")
                
                # 마크다운 확인
                if hasattr(item, 'markdown'):
                    md = item.markdown
                    if hasattr(md, 'raw_markdown') and md.raw_markdown:
                        print(f"  - 마크다운 길이: {len(md.raw_markdown)}")
                        print(f"  - 마크다운 일부: {md.raw_markdown[:50]}...")
                    else:
                        print("  - 마크다운: 없음")
                else:
                    print("  - 마크다운: 속성 없음")
        else:
            print(f"❌ 검색 실패! 결과가 없습니다. 소요 시간: {elapsed_time:.2f}초")
        
        return True
    except Exception as e:
        elapsed_time = time.time() - start_time
        print(f"❌ 검색 오류 발생! 소요 시간: {elapsed_time:.2f}초")
        print(f"  오류 메시지: {str(e)}")
        return False

async def main():
    print("="*50)
    print("crawl4ai 검색어 유형별 테스트")
    print("="*50)
    
    try:
        # 패키지 가져오기
        from crawl4ai import AsyncWebCrawler
        print("✅ crawl4ai 패키지 가져오기 성공!")
        
        # 검색어 목록 정의
        queries = [
            # 영어 검색어
            "Python programming",
            "artificial intelligence",
            
            # 한글 검색어
            "파이썬 프로그래밍",
            "인공지능",
            
            # 복잡한 쿼리
            "Python programming language for data science and machine learning applications",
            "파이썬을 활용한 데이터 과학과 머신러닝 애플리케이션 개발 방법론",
            
            # 짧은 쿼리
            "AI",
            "ML",
            
            # 특수문자 포함 쿼리
            "C++ programming",
            "Python 3.9+",
            "React.js & Node.js",
            "파이썬 3.9+ 설치 방법"
        ]
        
        # 크롤러 초기화
        async with AsyncWebCrawler() as crawler:
            # 각 검색어 테스트
            results = {}
            for query in queries:
                success = await test_search_query(crawler, query)
                results[query] = "성공" if success else "실패"
            
            # 결과 요약
            print("\n" + "="*50)
            print("검색어 테스트 결과 요약")
            print("="*50)
            
            success_count = list(results.values()).count("성공")
            total_count = len(results)
            
            print(f"총 {total_count}개 중 {success_count}개 성공 ({success_count/total_count*100:.1f}%)")
            print("\n검색어별 결과:")
            
            # 카테고리별 결과 출력
            categories = {
                "영어 검색어": ["Python programming", "artificial intelligence"],
                "한글 검색어": ["파이썬 프로그래밍", "인공지능"],
                "복잡한 쿼리": [
                    "Python programming language for data science and machine learning applications",
                    "파이썬을 활용한 데이터 과학과 머신러닝 애플리케이션 개발 방법론"
                ],
                "짧은 쿼리": ["AI", "ML"],
                "특수문자 포함 쿼리": ["C++ programming", "Python 3.9+", "React.js & Node.js", "파이썬 3.9+ 설치 방법"]
            }
            
            for category, category_queries in categories.items():
                category_results = {q: results.get(q, "테스트 안됨") for q in category_queries}
                category_success = list(category_results.values()).count("성공")
                category_total = len(category_results)
                
                print(f"\n{category} ({category_success}/{category_total} 성공):")
                for query, result in category_results.items():
                    print(f"  - '{query}': {result}")
            
            # 결과 파일 저장
            try:
                with open("crawl4ai_query_test_results.json", "w", encoding="utf-8") as f:
                    json.dump({
                        "summary": {
                            "total": total_count,
                            "success": success_count,
                            "success_rate": f"{success_count/total_count*100:.1f}%"
                        },
                        "results": results,
                        "categories": {
                            category: {
                                "queries": category_queries,
                                "results": {q: results.get(q, "테스트 안됨") for q in category_queries}
                            } for category, category_queries in categories.items()
                        }
                    }, f, ensure_ascii=False, indent=2)
                print("\n결과를 crawl4ai_query_test_results.json 파일로 저장했습니다.")
            except Exception as e:
                print(f"\n결과 저장 중 오류 발생: {e}")
                
    except Exception as e:
        print(f"❌ 테스트 중 오류 발생: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    print("crawl4ai 검색어 유형별 테스트 시작...\n")
    asyncio.run(main())
    print("\ncrawl4ai 검색어 유형별 테스트 완료!")
