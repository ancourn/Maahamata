import { Server } from 'socket.io';
import { CopilotAgent } from '@/ai-core/CopilotAgent';

export const setupSocket = (io: Server) => {
  const copilot = new CopilotAgent();
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle AI requests
    socket.on('ai_request', async (data) => {
      try {
        const result = await copilot.process(data.query, data.context);
        socket.emit('ai_response', {
          ...result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('AI request error:', error);
        socket.emit('ai_response', {
          reply: 'Sorry, I encountered an error processing your request.',
          agent: 'error',
          confidence: 0.1,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle messages (legacy support)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};