import { getZAI } from '@/lib/zai';

export class CalendarAgent {
  async handle(query: string, context: any) {
    try {
      const zai = await getZAI();
      
      const systemPrompt = `You are OrbitAI, a calendar assistant. Help users schedule meetings and manage their calendar.
      
      When asked to schedule something:
      1. Extract the date/time information
      2. Identify the meeting purpose
      3. Suggest appropriate duration
      4. Provide a clear summary
      
      Respond in JSON format:
      {
        "action": "schedule | suggest | inform",
        "title": "Meeting title",
        "proposed_time": "Date and time suggestion",
        "duration": "Duration in minutes",
        "summary": "Brief description of the meeting",
        "confidence": 0.0-1.0
      }`;

      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
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
        // If JSON parsing fails, return a structured response
        return {
          action: 'suggest',
          title: 'Calendar Request',
          proposed_time: 'Please specify date and time',
          duration: 30,
          summary: content,
          confidence: 0.7
        };
      }
    } catch (error) {
      console.error('Calendar agent error:', error);
      return {
        action: 'suggest',
        title: 'Calendar Request',
        proposed_time: 'Please check your calendar manually',
        duration: 30,
        summary: 'I had trouble processing your calendar request. Please try again with more specific details.',
        confidence: 0.4
      };
    }
  }
}