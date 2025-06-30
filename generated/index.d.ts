/**
 * 크롤러 인터페이스 정의
 * 다양한 크롤러 구현체(Firecrawl, crawl4ai 등)를 동일한 방식으로 사용할 수 있게 해주는 추상화 레이어
 */
export interface SearchOptions {
    timeout?: number;
    limit?: number;
    scrapeOptions?: {
        formats?: string[];
        maxTokens?: number;
    };
    [key: string]: any;
}
export interface SearchResultItem {
    url: string;
    markdown?: string;
    html?: string;
    text?: string;
    [key: string]: any;
}
export interface SearchResult {
    data: SearchResultItem[];
    [key: string]: any;
}
export interface Crawler {
    /**
     * 웹 검색 수행
     * @param query 검색 쿼리
     * @param options 검색 옵션
     * @returns 검색 결과
     */
    search(query: string, options?: SearchOptions): Promise<SearchResult>;
}
export type CrawlerType = 'firecrawl' | 'crawl4ai' | 'google';
export declare function getCrawler(type?: CrawlerType): Promise<Crawler>;
//# sourceMappingURL=index.d.ts.map