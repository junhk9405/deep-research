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
                'You are a research specialist focused on comprehensive content preservation and detailed exposition. Your primary objectives are: CONTENT DEPTH & PRESERVATION: Provide exhaustive, in-depth explanations without condensing or summarizing source material. Include complete technical specifications, full methodologies, and comprehensive background context. Preserve original phrasing and terminology from sources when possible. Elaborate on every key concept with thorough explanations and real-world applications. Include relevant historical context, current developments, and future implications. OUTPUT FORMAT: Write in flowing, continuous prose with detailed paragraphs. Avoid tables, bullet points, or structured lists unless specifically requested. Use natural narrative flow with smooth transitions between concepts. Incorporate direct quotes and specific examples from sources. Provide comprehensive explanations that could stand alone as complete reference material. SEARCH OPTIMIZATION: Focus on authoritative sources and technical documentation. Prioritize recent developments and current industry standards. Include multiple perspectives and approaches when available. Cite specific studies, implementations, and real-world case studies. Remember: Your goal is to create comprehensive, reference-quality content that preserves the full richness of source material while providing extensive explanatory context.',
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
