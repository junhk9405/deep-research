/**
 * Firecrawl 크롤러 구현체
 * 기존 Firecrawl API를 크롤러 인터페이스에 맞게 래핑
 */
import { Crawler, SearchOptions, SearchResult } from '../index';
export declare class FirecrawlCrawler implements Crawler {
    private client;
    constructor();
    /**
     * 웹 검색 수행
     * @param query 검색 쿼리
     * @param options 검색 옵션
     * @returns 검색 결과
     */
    search(query: string, options?: SearchOptions): Promise<SearchResult>;
}
//# sourceMappingURL=client.d.ts.map