'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type AIMessage = {
  text: string;
  sender: 'user' | 'ai';
  confidence?: number;
  timestamp?: string;
  agent?: string;
};

export function AICopilot() {
  const [messages, setMessages] = useState<AIMessage[]>([
    { 
      text: "Hi, I'm OrbitAI. Ask me to triage an email, find a document, or schedule a meeting.", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socketio',
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('ai_response', (data: any) => {
      setMessages(prev => [...prev, { 
        text: typeof data === 'string' ? data : (data.summary || data.reply || JSON.stringify(data)),
        sender: 'ai',
        confidence: data.confidence,
        timestamp: data.timestamp,
        agent: data.agent
      }]);
      setIsTyping(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;
    
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setIsTyping(true);
    
    socket.emit('ai_request', {
      query: input,
      context: { recentEmails: 5, calendarEvents: 3 }
    });
    
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full border-l w-96">
      <Card className="flex-1 flex flex-col border-0 rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            OrbitAI Copilot
            <span className={`text-sm px-2 py-1 rounded ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </CardTitle>
          <p className="text-sm text-gray-500">
            Ask anything about your work.
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4 py-2">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{msg.text}</div>
                    {msg.confidence && (
                      <div className="text-xs mt-1 opacity-75">
                        Confidence: {(msg.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                    {msg.agent && (
                      <div className="text-xs mt-1 opacity-75">
                        Agent: {msg.agent}
                      </div>
                    )}
                    {msg.timestamp && (
                      <div className="text-xs mt-1 opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <form 
            onSubmit={handleSubmit} 
            className="p-4 border-t space-y-2"
          >
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask OrbitAI..."
                disabled={!isConnected || isTyping}
                className="flex-1"
              />
              <Button 
                type="submit"
                disabled={!isConnected || !input.trim() || isTyping}
                size="sm"
              >
                Send
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Try: "Triage this email" or "Find the Q3 roadmap" or "Schedule a meeting"
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}