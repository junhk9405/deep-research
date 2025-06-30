/**
 * 크롤러별 Rate Limit 관리 유틸리티
 * 각 크롤러에서 독립적으로 사용할 수 있는 Rate Limiter
 */

export interface RateLimitConfig {
  requestsPerMinute: number;
  delayBetweenRequests: number;
  name: string;
}

export class RateLimiter {
  private requestHistory: number[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    console.log(`🚦 Rate Limiter 초기화: ${config.name}`);
    console.log(`   - 분당 요청 제한: ${config.requestsPerMinute}`);
    console.log(`   - 요청 간 지연: ${config.delayBetweenRequests}ms`);
  }

  /**
   * Rate Limit 체크 및 필요시 대기
   */
  async checkAndWait(): Promise<void> {
    const now = Date.now();
    
    // 1분 이내의 요청만 유지
    this.cleanupOldRequests(now);
    
    // Rate Limit 체크
    await this.waitForRateLimit(now);
    
    // 요청 간 최소 지연
    await this.waitForMinDelay(now);
    
    // 현재 요청 시간 기록
    this.requestHistory.push(now);
  }

  /**
   * 1분 이전의 요청 기록 정리
   */
  private cleanupOldRequests(now: number): void {
    const oneMinuteAgo = now - 60000;
    while (this.requestHistory.length > 0 && this.requestHistory[0]! < oneMinuteAgo) {
      this.requestHistory.shift();
    }
  }

  /**
   * Rate Limit 대기
   */
  private async waitForRateLimit(now: number): Promise<void> {
    if (this.requestHistory.length >= this.config.requestsPerMinute) {
      const oldestRequest = this.requestHistory[0];
      if (oldestRequest !== undefined) {
        const waitTime = 60000 - (now - oldestRequest);
        
        if (waitTime > 0) {
          console.log(`⏳ [${this.config.name}] Rate limit 대기 중... ${Math.ceil(waitTime / 1000)}초`);
          await this.sleep(waitTime);
        }
      }
    }
  }

  /**
   * 요청 간 최소 지연 대기
   */
  private async waitForMinDelay(now: number): Promise<void> {
    if (this.requestHistory.length > 0) {
      const lastRequest = this.requestHistory[this.requestHistory.length - 1];
      if (lastRequest !== undefined) {
        const timeSinceLastRequest = now - lastRequest;
        
        if (timeSinceLastRequest < this.config.delayBetweenRequests) {
          const delayTime = this.config.delayBetweenRequests - timeSinceLastRequest;
          console.log(`⏱️ [${this.config.name}] 요청 간격 조절... ${delayTime}ms 대기`);
          await this.sleep(delayTime);
        }
      }
    }
  }

  /**
   * 지연 함수
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 현재 상태 정보
   */
  getStatus(): { requestsInLastMinute: number; maxRequests: number } {
    const now = Date.now();
    this.cleanupOldRequests(now);
    
    return {
      requestsInLastMinute: this.requestHistory.length,
      maxRequests: this.config.requestsPerMinute
    };
  }
}

/**
 * 크롤러별 기본 설정
 */
export const RATE_LIMIT_CONFIGS = {
  firecrawl: {
    requestsPerMinute: 7,  // 무료 플랜 기준
    delayBetweenRequests: 10000, // 10초 간격
    name: 'Firecrawl'
  },
  perplexity: {
    requestsPerMinute: 100,
    delayBetweenRequests: 10, // 1초 간격
    name: 'Perplexity'
  },
  crawl4ai: {
    requestsPerMinute: 100,
    delayBetweenRequests: 1000,
    name: 'Crawl4AI'
  },
  google: {
    requestsPerMinute: 100,
    delayBetweenRequests: 10,
    name: 'Google'
  },
  brave: {
    requestsPerMinute: 60,  // Brave Search API 제한
    delayBetweenRequests: 1000, // 1초 간격
    name: 'Brave Search'
  }
} as const;
