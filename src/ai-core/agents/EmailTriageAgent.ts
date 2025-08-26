import fs from 'fs';
import path from 'path';
import { EmailTriageResult, AgentContext } from '../types';
import ZAI from 'z-ai-web-dev-sdk';

export class EmailTriageAgent {
  private systemPrompt: string;
  private zai: any;

  constructor() {
    this.systemPrompt = fs.readFileSync(
      path.join(process.cwd(), 'src/ai-core/prompts/EMAIL_TRIAGE_SYSTEM.md'),
      'utf-8'
    );
  }

  async handle(query: string, context: AgentContext): Promise<EmailTriageResult> {
    // If it's a real email, use LLM
    if (context.emailBody || context.subject || context.from) {
      try {
        return await this.processWithEmailLLM(context);
      } catch (error) {
        console.error('LLM processing failed, falling back to rules:', error);
        return this.fallbackProcessing(context);
      }
    }

    // Fallback to rule-based processing for general queries
    return this.fallbackProcessing(context);
  }

  private async processWithEmailLLM(context: AgentContext): Promise<EmailTriageResult> {
    const prompt = `
${this.systemPrompt}

Email:
From: ${context.from || 'Unknown'}
Subject: ${context.subject || 'No Subject'}
Body: ${context.emailBody || 'No body content'}

Please analyze this email and respond with ONLY a valid JSON object in this exact format:
{
  "category": "Priority|Follow-Up|Promo|Noise|Action-Required",
  "summary": "Brief one-sentence summary",
  "suggested_action": "Specific action recommendation",
  "urgency": number (1-10)
}
`;

    try {
      // Initialize ZAI SDK
      this.zai = await ZAI.create();
      
      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert email analysis assistant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from LLM');
      }

      // Parse JSON response
      const result = JSON.parse(response);
      
      // Validate and normalize the response
      return {
        category: this.normalizeCategory(result.category),
        summary: result.summary || 'Email analysis completed',
        suggested_action: result.suggested_action || 'Review and respond as needed',
        urgency: Math.max(1, Math.min(10, result.urgency || 5))
      };

    } catch (error) {
      console.error('LLM processing error:', error);
      throw error;
    }
  }

  private fallbackProcessing(context: AgentContext): EmailTriageResult {
    const lower = (context.subject || context.emailBody || query || '').toLowerCase();
    
    if (lower.includes("urgent") || lower.includes("asap") || lower.includes("immediate")) {
      return {
        category: "Priority",
        summary: "Message marked as urgent by sender.",
        suggested_action: "Reply immediately",
        urgency: 9
      };
    }
    if (lower.includes("meeting") || lower.includes("schedule") || lower.includes("appointment")) {
      return {
        category: "Action-Required",
        summary: "Request to schedule or reschedule a meeting.",
        suggested_action: "Propose 2 time options",
        urgency: 7
      };
    }
    if (lower.includes("newsletter") || lower.includes("promo") || lower.includes("deal") || lower.includes("offer")) {
      return {
        category: "Promo",
        summary: "Promotional content or newsletter.",
        suggested_action: "Archive or delete",
        urgency: 2
      };
    }
    if (lower.includes("thank") || lower.includes("appreciate") || lower.includes("great")) {
      return {
        category: "Follow-Up",
        summary: "Acknowledgment or thank you message.",
        suggested_action: "Reply briefly to acknowledge",
        urgency: 4
      };
    }
    return {
      category: "Follow-Up",
      summary: "General inquiry requiring response.",
      suggested_action: "Reply within 24h",
      urgency: 5
    };
  }

  private normalizeCategory(category: string): 'Priority' | 'Follow-Up' | 'Promo' | 'Noise' | 'Action-Required' {
    const normalized = category.toLowerCase().replace(/[-_\s]/g, '');
    
    switch (normalized) {
      case 'priority':
        return 'Priority';
      case 'actionrequired':
      case 'action-required':
        return 'Action-Required';
      case 'followup':
      case 'follow-up':
        return 'Follow-Up';
      case 'promo':
      case 'promotional':
        return 'Promo';
      case 'noise':
      case 'spam':
        return 'Noise';
      default:
        return 'Follow-Up';
    }
  }
}