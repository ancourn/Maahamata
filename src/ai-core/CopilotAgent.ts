import { EmailTriageAgent } from './agents/EmailTriageAgent';
import { SemanticSearchAgent } from './agents/SemanticSearchAgent';
import { CalendarAgent } from './agents/CalendarAgent';

export class CopilotAgent {
  private triageAgent = new EmailTriageAgent();
  private searchAgent = new SemanticSearchAgent();
  private calendarAgent = new CalendarAgent();

  async process(input: string, context: Record<string, any>) {
    const lower = input.toLowerCase();
    
    if (lower.includes('find') || lower.includes('search')) {
      return this.searchAgent.handle(input, context);
    }
    
    if (lower.includes('email') || lower.includes('reply') || lower.includes('triage')) {
      return this.triageAgent.handle(input, context);
    }
    
    if (lower.includes('schedule') || lower.includes('meeting') || lower.includes('calendar')) {
      return this.calendarAgent.handle(input, context);
    }
    
    return {
      reply: `I can help with email triage, document search, and calendar scheduling. Try asking: "Triage this email" or "Find the Q3 roadmap."`,
      agent: 'router',
      confidence: 0.9
    };
  }
}