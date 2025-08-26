import { SemanticSearchAgent } from './agents/SemanticSearchAgent';
import { EmailTriageAgent } from './agents/EmailTriageAgent';
import { CalendarAgent } from './agents/CalendarAgent';
import { AIResponse, AgentContext } from './types';

export class CopilotAgent {
  private triageAgent = new EmailTriageAgent();
  private searchAgent = new SemanticSearchAgent();
  private calendarAgent = new CalendarAgent();

  async process(query: string, context: AgentContext = {}): Promise<AIResponse> {
    try {
      // Route query to appropriate agent based on content
      if (this.isSearchQuery(query)) {
        const result = await this.searchAgent.handle(query, context);
        return {
          reply: this.formatSearchResponse(result),
          data: result,
          confidence: 0.9,
          timestamp: new Date().toISOString()
        };
      }

      if (this.isEmailQuery(query)) {
        const result = await this.triageAgent.handle(query, context);
        return {
          reply: this.formatEmailResponse(result),
          data: result,
          confidence: 0.85,
          timestamp: new Date().toISOString()
        };
      }

      if (this.isCalendarQuery(query)) {
        const result = await this.calendarAgent.handle(query, context);
        return {
          reply: this.formatCalendarResponse(result),
          data: result,
          confidence: 0.88,
          timestamp: new Date().toISOString()
        };
      }

      // Default response for unrecognized queries
      return {
        reply: "I can help you with search, email triage, and calendar management. Try asking me to find documents, analyze emails, or check your schedule.",
        confidence: 0.5,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        reply: "I apologize, but I encountered an error processing your request. Please try again.",
        confidence: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  private isSearchQuery(query: string): boolean {
    const searchKeywords = ['find', 'search', 'look for', 'locate', 'where is', 'show me'];
    return searchKeywords.some(keyword => query.toLowerCase().includes(keyword));
  }

  private isEmailQuery(query: string): boolean {
    const emailKeywords = ['email', 'reply', 'message', 'inbox', 'triage', 'categorize'];
    return emailKeywords.some(keyword => query.toLowerCase().includes(keyword));
  }

  private isCalendarQuery(query: string): boolean {
    const calendarKeywords = ['schedule', 'meeting', 'calendar', 'appointment', 'when', 'time'];
    return calendarKeywords.some(keyword => query.toLowerCase().includes(keyword));
  }

  private formatSearchResponse(result: any): string {
    if (result.results && result.results.length > 0) {
      const topResults = result.results.slice(0, 3);
      return `I found ${result.results.length} relevant items:\n\n${topResults.map((r: any, i: number) => 
        `${i + 1}. **${r.title}** (${r.type})\n   ${r.content}`
      ).join('\n\n')}`;
    }
    return "I couldn't find any relevant results for your search.";
  }

  private formatEmailResponse(result: any): string {
    return `Email Analysis:\n\n**Category:** ${result.category}\n**Summary:** ${result.summary}\n**Suggested Action:** ${result.suggested_action}\n**Urgency:** ${result.urgency}/10`;
  }

  private formatCalendarResponse(result: any): string {
    let response = `Calendar Overview:\n\n`;
    
    if (result.events && result.events.length > 0) {
      response += `**Upcoming Events:**\n`;
      result.events.forEach((event: any) => {
        response += `- ${event.title} at ${event.start.toLocaleTimeString()}\n`;
      });
    }

    if (result.suggestions && result.suggestions.length > 0) {
      response += `\n**Suggested Times:**\n`;
      result.suggestions.forEach((suggestion: any) => {
        response += `- ${suggestion.title} at ${suggestion.start.toLocaleTimeString()}\n`;
      });
    }

    return response;
  }
}