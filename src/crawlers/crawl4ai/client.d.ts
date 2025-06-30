/**
 * crawl4ai 크롤러 구현체
 * Node.js에서 Python 프로세스를 실행하여 crawl4ai를 호출
 */
import { Crawler, SearchOptions, SearchResult } from '../index';
export declare class Crawl4aiCrawler implements Crawler {
    private pythonPath;
    private scriptPath;
    constructor();
    /**
     * 웹 검색 수행
     * @param query 검색 쿼리
     * @param options 검색 옵션
     * @returns 검색 결과
     */
    /**
     * 지정된 시간(ms) 동안 대기하는 유틸리티 함수
     */
    private sleep;
    /**
     * Google Custom Search API 호출 함수 (재시도 로직 포함)
     */
    private fetchGoogleSearchResults;
    search(query: string, options?: SearchOptions): Promise<SearchResult>;
    /**
     * Python 프로세스 실행
     * @param args 명령줄 인자
     * @returns 프로세스 실행 결과
     */
    private runPythonProcess;
    /**
     * crawl4ai 결과를 Firecrawl 형식으로 변환
     * @param result crawl4ai 결과
     * @returns Firecrawl 형식 결과
     */
    private convertToFirecrawlFormat;
    /**
     * crawl4ai 실행 스크립트 생성
     * @returns 스크립트 파일 경로
     */
    private createCrawl4aiScript;
}
//# sourceMappingURL=client.d.ts.map