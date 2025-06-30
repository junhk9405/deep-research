/**
 * Google Custom Search API 크롤러 구현체
 * Google Custom Search JSON API를 크롤러 인터페이스에 맞게 래핑
 */
import axios from 'axios';
export class GoogleCrawler {
    apiKey;
    searchEngineId;
    apiUrl;
    constructor() {
        // API 키와 검색 엔진 ID 직접 설정
        this.apiKey = 'AIzaSyA1vcG82q9G3XljHCsbnaAj8DaFI0qF_S4';
        this.searchEngineId = '33616c3af044d4a62';
        // Google Custom Search API URL
        this.apiUrl = 'https://www.googleapis.com/customsearch/v1';
        console.log('Google Custom Search API 초기화 완료');
        console.log('API 키와 검색 엔진 ID가 코드에 직접 설정되었습니다.');
    }
    /**
     * 웹 검색 수행
     * @param query 검색 쿼리
     * @param options 검색 옵션
     * @returns 검색 결과
     */
    async search(query, options) {
        try {
            // 검색 옵션 설정
            const limit = options?.limit || 10;
            const timeout = options?.timeout || 30000;
            // Google Custom Search API 호출
            const response = await axios.get(this.apiUrl, {
                params: {
                    key: this.apiKey,
                    cx: this.searchEngineId,
                    q: query,
                    num: limit > 10 ? 10 : limit, // Google API는 최대 10개 결과만 지원
                    // 추가 파라미터 설정 가능
                },
                timeout: timeout,
            });
            // 결과가 없는 경우
            if (!response.data.items || response.data.items.length === 0) {
                return { data: [] };
            }
            // Google API 응답을 SearchResult 형식으로 변환
            const items = response.data.items.map((item) => ({
                url: item.link,
                markdown: item.snippet || '', // 스니펫을 마크다운으로 사용
                title: item.title || '',
                // 추가 필드 매핑 가능
            }));
            return { data: items };
        }
        catch (error) {
            console.error('Error in Google Custom Search:', error);
            throw error;
        }
    }
}
