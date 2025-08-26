import fs from 'fs';
import path from 'path';
import { getZAI } from '@/lib/zai';

export class EmailTriageAgent {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = fs.readFileSync(
      path.join(process.cwd(), 'src/ai-core/prompts/EMAIL_TRIAGE_SYSTEM.md'),
      'utf-8'
    );
  }

  async handle(query: string, context: any) {
    try {
      const zai = await getZAI();
      
      const prompt = `${this.systemPrompt}\n\nEmail:\n${query}\n\nRespond in JSON only.`;
      
      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        model: 'llama3-70b',
        temperature: 0.3,
        max_tokens: 256
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      // Try to parse JSON response
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, return a structured response with the raw content
        return {
          category: 'Follow-Up',
          summary: content,
          suggested_action: 'Review manually',
          urgency: 5,
          confidence: 0.7
        };
      }
    } catch (error) {
      console.error('AI triage error:', error);
      return {
        category: 'Follow-Up',
        summary: 'Unable to analyze email content.',
        suggested_action: 'Review manually',
        urgency: 5,
        confidence: 0.6
      };
    }
  }
}