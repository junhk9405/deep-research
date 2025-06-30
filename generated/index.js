/**
 * 크롤러 인터페이스 정의
 * 다양한 크롤러 구현체(Firecrawl, crawl4ai 등)를 동일한 방식으로 사용할 수 있게 해주는 추상화 레이어
 */

// 크롤러 팩토리 함수 (사용할 크롤러 타입에 따라 적절한 구현체 반환)
async function getCrawler(type = 'crawl4ai') {
    switch (type) {
        case 'firecrawl': {
            const { FirecrawlCrawler } = require('./firecrawl/client');
            return new FirecrawlCrawler();
        }
        case 'crawl4ai': {
            const { Crawl4aiCrawler } = require('./crawl4ai/client');
            return new Crawl4aiCrawler();
        }
        case 'google': {
            const { GoogleCrawler } = require('./google/client');
            return new GoogleCrawler();
        }
        case 'perplexity': {
            const { PerplexityCrawler } = require('./perplexity/client');
            const apiKey = "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";
            if (!apiKey) {
                throw new Error('PERPLEXITY_API_KEY is not set in environment variables');
            }
            return new PerplexityCrawler(apiKey);
        }
        case 'brave': {
            const { BraveSearchCrawler } = require('./brave/client');
            const braveApiKey = process.env.BRAVE_SEARCH_API_KEY;
            if (!braveApiKey) {
                throw new Error('BRAVE_SEARCH_API_KEY is not set in environment variables');
            }
            return new BraveSearchCrawler(braveApiKey);
        }
        default:
            throw new Error(`Unknown crawler type: ${type}`);
    }
}

module.exports = { getCrawler };
