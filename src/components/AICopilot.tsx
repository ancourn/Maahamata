'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Brain, Sparkles } from 'lucide-react'
import socket from '@/lib/socket-client'

interface Message {
  text: string
  sender: 'user' | 'ai'
  timestamp: string
  data?: any
}

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi, I'm OrbitAI! I can help you with search, email triage, calendar management, and more. How can I assist you today?", 
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check socket connection
    const checkConnection = () => {
      setIsConnected(socket.connected)
    }

    socket.on('connect', checkConnection)
    socket.on('disconnect', checkConnection)
    checkConnection()

    // Handle AI responses
    socket.on('ai_response', (data) => {
      setMessages(prev => [...prev, {
        text: data.reply,
        sender: 'ai',
        timestamp: data.timestamp,
        data: data.data
      }])
      setIsTyping(false)
    })

    // Handle email triage responses
    socket.on('email_triage_response', (data) => {
      const response = `Email Analysis:\n\n**Category:** ${data.category}\n**Summary:** ${data.summary}\n**Suggested Action:** ${data.suggested_action}\n**Urgency:** ${data.urgency}/10`
      
      setMessages(prev => [...prev, {
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        data: data
      }])
      setIsTyping(false)
    })

    // Handle search responses
    socket.on('search_response', (data) => {
      setMessages(prev => [...prev, {
        text: data.reply,
        sender: 'ai',
        timestamp: data.timestamp,
        data: data.data
      }])
      setIsTyping(false)
    })

    // Handle calendar responses
    socket.on('calendar_response', (data) => {
      setMessages(prev => [...prev, {
        text: data.reply,
        sender: 'ai',
        timestamp: data.timestamp,
        data: data.data
      }])
      setIsTyping(false)
    })

    return () => {
      socket.off('connect', checkConnection)
      socket.off('disconnect', checkConnection)
      socket.off('ai_response')
      socket.off('email_triage_response')
      socket.off('search_response')
      socket.off('calendar_response')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !isConnected) return

    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Send AI request
    socket.emit('ai_request', {
      query: input,
      context: { 
        recentEmails: 5, 
        calendarEvents: 3,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    })

    setInput('')
  }

  const handleQuickAction = (action: string) => {
    if (!isConnected) return

    const actionMessages = {
      search: "Find my recent documents about AI strategy",
      email: "Triage this email: 'Hey, can we push the demo to Thursday? Client needs more time.'",
      calendar: "Show me my upcoming meetings"
    }

    const message = actionMessages[action as keyof typeof actionMessages]
    if (message) {
      setInput(message)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full border-l bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">OrbitAI Copilot</CardTitle>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Ask me anything about your work, documents, emails, or schedule.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b">
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction('search')}
            disabled={!isConnected}
          >
            🔍 Search
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction('email')}
            disabled={!isConnected}
          >
            📧 Email Triage
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAction('calendar')}
            disabled={!isConnected}
          >
            📅 Calendar
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={`space-y-1 ${
                    msg.sender === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`px-3 py-2 rounded-lg text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {msg.text.split('\n').map((line, j) => (
                        <div key={j}>{line}</div>
                      ))}
                    </div>
                    <div className={`text-xs text-muted-foreground ${
                      msg.sender === 'user' ? 'text-right' : ''
                    }`}>
                      {formatTimestamp(msg.timestamp)}
                      {msg.data?.confidence && (
                        <span className="ml-2">
                          Confidence: {Math.round(msg.data.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="space-y-1">
                    <div className="px-3 py-2 rounded-lg text-sm bg-muted text-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="ml-2">OrbitAI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isConnected ? "Ask OrbitAI..." : "Connecting..."}
            className="flex-1"
            disabled={!isConnected}
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={!input.trim() || !isConnected || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ Disconnected from AI server. Please check your connection.
          </p>
        )}
      </form>
    </div>
  )
}