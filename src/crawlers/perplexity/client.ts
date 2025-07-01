import { Crawler, SearchResult } from '..';

export class PerplexityCrawler implements Crawler {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'sonar-pro') {
    if (!apiKey) {
      throw new Error('Perplexity API key is required.');
    }
    this.apiKey = apiKey;
    this.model = model;
  }

  async search(query: string): Promise<SearchResult> {
    console.log(`[PerplexityCrawler] Searching for: ${query}`);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are an AI research assistant. Your goal is to provide highly detailed, comprehensive, and lengthy factual answers based on web search results. Please elaborate on concepts, provide in-depth explanations, and ensure your response is as thorough as possible.',
            },
            { role: 'user', content: query },
          ],
          web_search_options: {
            search_context_size: 'high'
          }
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `[PerplexityCrawler] API error: ${response.status} ${response.statusText}`,
          errorBody,
        );
        throw new Error(
          `Perplexity API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        console.warn('[PerplexityCrawler] No content received from Perplexity API.');
        return { data: [] };
      }

      console.log('[PerplexityCrawler] Received response from Perplexity.');

      return {
        data: [
          {
            url: `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`,
            markdown: content,
          },
        ],
      };
    } catch (error) {
      console.error('[PerplexityCrawler] Error during search:', error);
      return { data: [] };
    }
  }
}
