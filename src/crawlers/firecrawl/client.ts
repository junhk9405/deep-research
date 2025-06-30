/**
 * Firecrawl 크롤러 구현체
 * 기존 Firecrawl API를 크롤러 인터페이스에 맞게 래핑
 * Rate Limit 관리 포함
 */

import FirecrawlApp, { SearchResponse } from '@mendable/firecrawl-js';
import { Crawler, SearchOptions, SearchResult } from '../index';
import { RateLimiter, RATE_LIMIT_CONFIGS } from '../rate-limiter';

export class FirecrawlCrawler implements Crawler {
  private client: FirecrawlApp;
  private rateLimiter: RateLimiter;

  constructor() {
    // 환경 변수에서 API 키와 URL을 가져오거나 기본값 사용
    const API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-87dc30ff4bb449c196319b19d7212ca6';
    const API_URL = process.env.FIRECRAWL_API_URL || 'https://api.firecrawl.dev';
    
    // Firecrawl 클라이언트 초기화
    this.client = new FirecrawlApp({
      apiKey: API_KEY,
      apiUrl: API_URL,
    });

    // Rate Limiter 초기화
    this.rateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.firecrawl);
  }

  /**
   * 웹 검색 수행 (Rate Limit 적용)
   * @param query 검색 쿼리
   * @param options 검색 옵션
   * @returns 검색 결과
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    try {
      // Rate Limit 체크 및 대기
      await this.rateLimiter.checkAndWait();
      
      // 현재 상태 로깅
      const status = this.rateLimiter.getStatus();
      console.log(`🔥 [Firecrawl] 검색 실행: "${query}" (${status.requestsInLastMinute}/${status.maxRequests})`);
      
      // Firecrawl API 호출
      const result = await this.client.search(query, options);
      return result as SearchResult;
    } catch (error) {
      console.error('Error in Firecrawl search:', error);
      throw error;
    }
  }
}
