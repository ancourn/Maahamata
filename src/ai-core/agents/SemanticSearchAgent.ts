import { getZAI } from '@/lib/zai';

export class SemanticSearchAgent {
  async handle(query: string, context: any) {
    try {
      const zai = await getZAI();
      
      // Use web search function if available
      const searchResults = await zai.functions.invoke('web_search', {
        query: query,
        num: 5
      });

      // Format the search results
      const formattedResults = searchResults.map((result: any) => 
        `- ${result.name}: ${result.snippet} (${result.url})`
      ).join('\n');

      return {
        reply: `I found the following results for "${query}":\n\n${formattedResults}`,
        agent: 'semantic-search',
        confidence: 0.85,
        results: searchResults
      };
    } catch (error) {
      console.error('Semantic search error:', error);
      return {
        reply: `I couldn't perform a web search for "${query}". Please try a different query or check your connection.`,
        agent: 'semantic-search',
        confidence: 0.3
      };
    }
  }
}