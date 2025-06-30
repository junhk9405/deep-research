/**
 * Firecrawl 크롤러 구현체
 * 기존 Firecrawl API를 크롤러 인터페이스에 맞게 래핑
 */
import FirecrawlApp from '@mendable/firecrawl-js';
export class FirecrawlCrawler {
    client;
    constructor() {
        // 환경 변수에서 API 키와 URL을 가져오거나 기본값 사용
        const API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-87dc30ff4bb449c196319b19d7212ca6';
        const API_URL = process.env.FIRECRAWL_API_URL || 'https://api.firecrawl.dev';
        // Firecrawl 클라이언트 초기화
        this.client = new FirecrawlApp({
            apiKey: API_KEY,
            apiUrl: API_URL,
        });
    }
    /**
     * 웹 검색 수행
     * @param query 검색 쿼리
     * @param options 검색 옵션
     * @returns 검색 결과
     */
    async search(query, options) {
        try {
            // Firecrawl API 직접 호출
            const result = await this.client.search(query, options);
            return result;
        }
        catch (error) {
            console.error('Error in Firecrawl search:', error);
            throw error;
        }
    }
}
