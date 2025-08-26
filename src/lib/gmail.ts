import { google } from 'googleapis';
import { db } from './db';

export async function syncUserEmails(userId: string) {
  try {
    // Get user's Google tokens from DB (Prisma)
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { googleTokens: true }
    });
    
    if (!user?.googleTokens) {
      throw new Error('No Google tokens found for user');
    }

    // Configure Google API
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    auth.setCredentials(user.googleTokens);
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Fetch unread inbox emails
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 10,
      q: 'is:unread'
    });

    if (!res.data.messages || res.data.messages.length === 0) {
      return [];
    }

    // Process each email
    const processedEmails = [];
    for (const msg of res.data.messages) {
      try {
        const full = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full'
        });

        // Extract headers and body
        const headers = full.data.payload?.headers || [];
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
        
        // Extract body text
        let body = '';
        if (full.data.payload?.body?.data) {
          body = decodeBase64(full.data.payload.body.data);
        } else if (full.data.payload?.parts) {
          for (const part of full.data.payload.parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              body = decodeBase64(part.body.data);
              break;
            }
          }
        }

        // AI triage
        const triage = await new EmailTriageAgent().handle(body, {
          from,
          subject,
          userId
        });

        // Save to DB
        const saved = await db.email.create({
          data: {
            id: msg.id,
            userId,
            from,
            subject,
            body,
            category: triage.category,
            urgency: triage.urgency,
            suggestedAction: triage.suggested_action,
            confidence: triage.confidence,
            processedAt: new Date()
          }
        });
        
        processedEmails.push(saved);
        
        // Notify UI via Socket.IO (this will be handled by the socket server)
        // The socket server will emit to the specific user room
        
      } catch (error) {
        console.error(`Error processing email ${msg.id}:`, error);
      }
    }
    
    return processedEmails;
  } catch (error) {
    console.error('Email sync failed:', error);
    throw error;
  }
}

// Helper function to decode base64 URL-safe encoding
function decodeBase64(str: string): string {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

// Email Triage Agent Class
class EmailTriageAgent {
  private systemPrompt = `You are an intelligent email triage assistant. Analyze emails and categorize them with urgency and suggested actions.

Categories:
- Priority: Urgent, time-sensitive matters requiring immediate attention
- Action-Required: Emails that need a response or specific action
- Informational: General updates, newsletters, notifications
- Follow-Up: Emails that can be addressed later
- Spam: Unwanted or promotional emails

Urgency scale: 1-10 (10 being most urgent)

Respond in JSON format with:
{
  "category": "string",
  "summary": "string",
  "suggested_action": "string",
  "urgency": number,
  "confidence": number
}`;

  async handle(emailBody: string, context: { from: string; subject: string; userId: string }) {
    try {
      const prompt = `${this.systemPrompt}

Email:
From: ${context.from}
Subject: ${context.subject}
Body: ${emailBody}
Respond in JSON only.`;

      const ZAI = await import('z-ai-web-dev-sdk');
      const zai = await ZAI.create();

      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      });

      const responseText = response.choices[0]?.message?.content || '{}';
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Email triage failed:', error);
      return {
        category: 'Follow-Up',
        summary: 'Unable to analyze email content',
        suggested_action: 'Review manually',
        urgency: 5,
        confidence: 0.6
      };
    }
  }
}

// Mock function for demonstration (since we don't have real Google tokens)
export async function mockSyncUserEmails(userId: string) {
  // Create some mock emails for demonstration
  const mockEmails = [
    {
      from: 'john@example.com',
      subject: 'Urgent: Project Deadline Update',
      body: 'Hi, we need to move the project deadline forward by 2 days due to client requirements. Please review and confirm.',
      category: 'Priority',
      urgency: 9,
      suggestedAction: 'Review and respond immediately',
      confidence: 0.95
    },
    {
      from: 'newsletter@tech.com',
      subject: 'Weekly Tech Digest',
      body: 'This week in tech: New frameworks, AI updates, and industry news...',
      category: 'Informational',
      urgency: 2,
      suggestedAction: 'Read when convenient',
      confidence: 0.9
    },
    {
      from: 'billing@company.com',
      subject: 'Invoice #12345 - Payment Required',
      body: 'Your invoice is due for payment. Please settle the amount to avoid service interruption.',
      category: 'Action-Required',
      urgency: 7,
      suggestedAction: 'Pay invoice or contact billing',
      confidence: 0.98
    }
  ];

  const processedEmails = [];
  for (let i = 0; i < mockEmails.length; i++) {
    const email = mockEmails[i];
    const saved = await db.email.create({
      data: {
        id: `mock-email-${i + 1}`,
        userId,
        from: email.from,
        subject: email.subject,
        body: email.body,
        category: email.category,
        urgency: email.urgency,
        suggestedAction: email.suggestedAction,
        confidence: email.confidence,
        processedAt: new Date()
      }
    });
    processedEmails.push(saved);
  }

  return processedEmails;
}