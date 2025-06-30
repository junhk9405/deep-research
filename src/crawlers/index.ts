/**
 * 크롤러 인터페이스 정의
 * 다양한 크롤러 구현체(Firecrawl, crawl4ai 등)를 동일한 방식으로 사용할 수 있게 해주는 추상화 레이어
 */

// 검색 옵션 인터페이스 (Firecrawl과 호환)
export interface SearchOptions {
  timeout?: number;
  limit?: number;
  scrapeOptions?: {
    formats?: string[];
    maxTokens?: number;
  };
  [key: string]: any; // 기타 옵션들을 위한 인덱스 시그니처
}

// 검색 결과 아이템 인터페이스
export interface SearchResultItem {
  url: string;
  markdown?: string;
  html?: string;
  text?: string;
  [key: string]: any; // 기타 필드들을 위한 인덱스 시그니처
}

// 검색 결과 인터페이스 (Firecrawl의 SearchResponse와 호환)
export interface SearchResult {
  data: SearchResultItem[];
  [key: string]: any; // 기타 필드들을 위한 인덱스 시그니처
}

// 크롤러 인터페이스
export interface Crawler {
  /**
   * 웹 검색 수행
   * @param query 검색 쿼리
   * @param options 검색 옵션
   * @returns 검색 결과
   */
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
}

// 크롤러 타입 (현재 지원하는 크롤러 유형)
export type CrawlerType = 'firecrawl' | 'crawl4ai' | 'google' | 'perplexity';

// 크롤러 팩토리 함수 (사용할 크롤러 타입에 따라 적절한 구현체 반환)
export async function getCrawler(
  type: CrawlerType = 'crawl4ai',
): Promise<Crawler> {
  switch (type) {
    case 'firecrawl': {
      const { FirecrawlCrawler } = await import('./firecrawl/client');
      return new FirecrawlCrawler();
    }
    case 'crawl4ai': {
      const { Crawl4aiCrawler } = await import('./crawl4ai/client');
      return new Crawl4aiCrawler();
    }
    case 'google': {
      const { GoogleCrawler } = await import('./google/client');
      return new GoogleCrawler();
    }
    case 'perplexity': {
      const { PerplexityCrawler } = await import('./perplexity/client');
      const apiKey = "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";
      if (!apiKey) {
        throw new Error(
          'PERPLEXITY_API_KEY is not set in environment variables',
        );
      }
      return new PerplexityCrawler(apiKey);
    }
    default:
      throw new Error(`Unknown crawler type: ${type}`);
  }
}
