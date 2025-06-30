/**
 * Google Custom Search API 크롤러 구현체
 * Google Custom Search JSON API를 크롤러 인터페이스에 맞게 래핑
 */
import { Crawler, SearchOptions, SearchResult } from '../index';
export declare class GoogleCrawler implements Crawler {
    private apiKey;
    private searchEngineId;
    private apiUrl;
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