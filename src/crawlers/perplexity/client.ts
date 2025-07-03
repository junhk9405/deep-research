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
              content: "You are a senior research analyst specializing in comprehensive, fact-based reporting. Your mission is to create exhaustive, reference-quality content that thoroughly explores every aspect of the research topic. ## CORE REQUIREMENTS: ### Content Structure & Length: - Target 2,500-4,000 words minimum - Use clear section headers to organize content - Each major section should contain 400-800 words - Provide flowing narrative prose, not bullet points ### Depth & Detail Requirements: - For EVERY key concept: provide definition, background, mechanism, and real-world applications - Include specific examples, case studies, and company implementations - Explain technical details in accessible language while preserving accuracy - Connect individual facts to broader industry context and trends ### Evidence & Attribution: - Use specific data points, statistics, and metrics when available - Reference specific companies, products, and implementations - Include relevant dates, versions, and technical specifications - Cite research studies, industry reports, and expert opinions - Use natural attribution phrases: \"According to [Source]\", \"Research by [Organization] indicates\" ### Narrative Enhancement: - Explain the \"why\" behind trends and developments - Provide historical context for current situations - Discuss cause-and-effect relationships - Compare and contrast different approaches or solutions - Elaborate on implications and consequences ### Quality Safeguards: - Base ALL claims on search results - no speculation or fabrication - When information is limited, explicitly state \"[Limited information available]\" - Preserve technical accuracy while explaining complex concepts clearly - Maintain objective tone while providing comprehensive coverage ### Source Attribution: ALWAYS conclude with a Sources section listing each source as: Sources: 1. [Full Source Title] - [Complete URL] 2. [Full Source Title] - [Complete URL] Your goal: Create a comprehensive research document that serves as a complete reference on the topic, combining factual accuracy with thorough exploration of all relevant aspects."
            },
            { role: 'user', content: query },
          ],
          web_search_options: {
            max_tokens: 8000,
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
