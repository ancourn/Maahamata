import { createServer } from 'http';
import { Server } from 'socket.io';
import { CopilotAgent } from '../src/ai-core/CopilotAgent';
import { emailTriageService } from '../src/lib/email-triage';
import { cookies } from 'next/headers';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const copilotAgent = new CopilotAgent();

// Store socket server globally for email service
global.socketServer = io;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle AI requests
  socket.on('ai_request', async (data) => {
    try {
      console.log('AI Request received:', data);
      
      const result = await copilotAgent.process(data.query, data.context);
      
      socket.emit('ai_response', result);
      console.log('AI Response sent:', result);
    } catch (error) {
      console.error('Error processing AI request:', error);
      socket.emit('ai_response', {
        reply: 'I apologize, but I encountered an error processing your request.',
        confidence: 0,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle email triage requests
  socket.on('email_triage_request', async (data) => {
    try {
      const result = await copilotAgent.process(data.emailContent, {
        userId: data.userId,
        recentEmails: data.recentEmails
      });
      
      socket.emit('email_triage_response', result);
    } catch (error) {
      console.error('Error processing email triage:', error);
      socket.emit('email_triage_response', {
        category: 'Error',
        summary: 'Could not process email',
        suggested_action: 'Try again later',
        urgency: 0
      });
    }
  });

  // Handle Gmail sync requests
  socket.on('gmail_sync_request', async (data) => {
    try {
      const { userId, maxResults = 10 } = data;
      
      // Import Gmail sync function
      const { syncUserEmails } = await import('../src/lib/gmail');
      const emails = await syncUserEmails(userId, maxResults);
      
      socket.emit('gmail_sync_response', {
        success: true,
        message: `Synced ${emails.length} emails`,
        emails: emails.map(email => ({
          id: email.id,
          from: email.from,
          subject: email.subject,
          snippet: email.snippet,
          received: email.received
        }))
      });

      // Auto-trigger email triage for new emails
      if (emails.length > 0) {
        const triageResult = await emailTriageService.processUnprocessedEmails(userId);
        socket.emit('email_triage_complete', triageResult);
      }

    } catch (error) {
      console.error('Error processing Gmail sync:', error);
      socket.emit('gmail_sync_response', {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      });
    }
  });

  // Handle email triage for specific email
  socket.on('triage_email_request', async (data) => {
    try {
      const { emailId } = data;
      const result = await emailTriageService.triageSingleEmail(emailId);
      
      socket.emit('triage_email_response', result);
    } catch (error) {
      console.error('Error triaging email:', error);
      socket.emit('triage_email_response', {
        success: false,
        error: error instanceof Error ? error.message : 'Triage failed'
      });
    }
  });

  // Handle search requests
  socket.on('search_request', async (data) => {
    try {
      const result = await copilotAgent.process(data.query, {
        userId: data.userId,
        timezone: data.timezone
      });
      
      socket.emit('search_response', result);
    } catch (error) {
      console.error('Error processing search:', error);
      socket.emit('search_response', {
        reply: 'Search failed. Please try again.',
        confidence: 0,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle calendar requests
  socket.on('calendar_request', async (data) => {
    try {
      const result = await copilotAgent.process(data.query, {
        userId: data.userId,
        timezone: data.timezone,
        calendarEvents: data.calendarEvents
      });
      
      socket.emit('calendar_response', result);
    } catch (error) {
      console.error('Error processing calendar request:', error);
      socket.emit('calendar_response', {
        reply: 'Calendar request failed. Please try again.',
        confidence: 0,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle auto-triage start/stop
  socket.on('start_auto_triage', async (data) => {
    try {
      const { userId, intervalMinutes = 5 } = data;
      const interval = await emailTriageService.startAutoTriageInterval(userId, intervalMinutes);
      
      socket.emit('auto_triage_started', {
        userId,
        intervalMinutes,
        message: `Auto-triage started every ${intervalMinutes} minutes`
      });
    } catch (error) {
      console.error('Error starting auto-triage:', error);
      socket.emit('auto_triage_error', {
        error: error instanceof Error ? error.message : 'Failed to start auto-triage'
      });
    }
  });

  socket.on('stop_auto_triage', async (data) => {
    try {
      const { userId } = data;
      emailTriageService.stopAutoTriageInterval(userId);
      
      socket.emit('auto_triage_stopped', {
        userId,
        message: 'Auto-triage stopped'
      });
    } catch (error) {
      console.error('Error stopping auto-triage:', error);
      socket.emit('auto_triage_error', {
        error: error instanceof Error ? error.message : 'Failed to stop auto-triage'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});