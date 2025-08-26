import { google } from 'googleapis';
import { client } from '@/lib/auth/google';
import { prisma } from '@/lib/db';

export interface GmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body?: string;
  htmlBody?: string;
  received: Date;
  labels: string[];
  attachments: any[];
}

export async function syncUserEmails(userId: string, maxResults: number = 10) {
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { googleTokens: true }
  });

  if (!user?.googleTokens) {
    throw new Error('No Google tokens found for user');
  }

  const tokens = JSON.parse(user.googleTokens);
  client.setCredentials(tokens);

  const gmail = google.gmail({ version: 'v1', auth: client });

  try {
    // Get list of messages
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults,
      q: 'is:unread'
    });

    if (!res.data.messages) {
      return [];
    }

    // Fetch full message details
    const emails = await Promise.all(
      res.data.messages.map(async (msg) => {
        const full = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'full'
        });

        const headers = full.data.payload?.headers || [];
        const body = full.data.payload?.body;
        const parts = full.data.payload?.parts || [];

        // Extract email content
        let emailBody = '';
        let htmlBody = '';

        if (body?.data) {
          emailBody = Buffer.from(body.data, 'base64').toString();
        }

        // Check for parts (multipart emails)
        for (const part of parts) {
          if (part.mimeType === 'text/plain' && part.body?.data) {
            emailBody = Buffer.from(part.body.data, 'base64').toString();
          } else if (part.mimeType === 'text/html' && part.body?.data) {
            htmlBody = Buffer.from(part.body.data, 'base64').toString();
          }
        }

        // Extract headers
        const from = headers.find(h => h.name === 'From')?.value || '';
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const date = headers.find(h => h.name === 'Date')?.value || '';

        return {
          id: msg.id!,
          gmailId: msg.id!,
          userId,
          from,
          subject,
          snippet: full.data.snippet || '',
          body: emailBody,
          htmlBody,
          received: date ? new Date(date) : new Date(parseInt(full.data.internalDate || '0')),
          labels: full.data.labelIds || [],
          attachments: parts.filter(part => part.filename && part.filename.length > 0).map(part => ({
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body?.size
          }))
        } as GmailMessage & { gmailId: string; userId: string };
      })
    );

    // Store emails in database
    for (const email of emails) {
      await prisma.email.upsert({
        where: { gmailId: email.gmailId },
        update: {
          from: email.from,
          subject: email.subject,
          snippet: email.snippet,
          body: email.body,
          htmlBody: email.htmlBody,
          received: email.received,
          labels: JSON.stringify(email.labels),
          attachments: JSON.stringify(email.attachments),
          updatedAt: new Date()
        },
        create: {
          gmailId: email.gmailId,
          userId,
          from: email.from,
          subject: email.subject,
          snippet: email.snippet,
          body: email.body,
          htmlBody: email.htmlBody,
          received: email.received,
          labels: JSON.stringify(email.labels),
          attachments: JSON.stringify(email.attachments)
        }
      });
    }

    return emails;
  } catch (error) {
    console.error('Gmail sync error:', error);
    throw error;
  }
}

export async function getUserEmails(userId: string, limit: number = 20) {
  return await prisma.email.findMany({
    where: { userId },
    orderBy: { received: 'desc' },
    take: limit
  });
}

export async function getUnprocessedEmails(userId: string) {
  return await prisma.email.findMany({
    where: { 
      userId, 
      aiProcessed: false 
    },
    orderBy: { received: 'desc' }
  });
}

export async function updateEmailAnalysis(
  emailId: string, 
  analysis: {
    category: string;
    urgency: number;
    suggestedAction: string;
  }
) {
  return await prisma.email.update({
    where: { id: emailId },
    data: {
      category: analysis.category as any,
      urgency: analysis.urgency,
      suggestedAction: analysis.suggestedAction,
      aiProcessed: true,
      updatedAt: new Date()
    }
  });
}