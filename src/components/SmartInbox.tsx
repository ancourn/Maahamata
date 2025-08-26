'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mail, Star, Archive, Reply, Clock, AlertTriangle, CheckCircle, Sync, RefreshCw, Settings } from 'lucide-react'
import socket from '@/lib/socket-client'

interface Email {
  id: string
  gmailId: string
  sender: string
  subject: string
  preview: string
  category: 'Priority' | 'Follow-Up' | 'Promo' | 'Noise' | 'Action-Required'
  urgency: number
  suggestedAction: string
  timestamp: string
  read: boolean
  starred: boolean
  aiProcessed: boolean
}

export function SmartInbox() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [autoTriageActive, setAutoTriageActive] = useState(false)

  useEffect(() => {
    // Check socket connection
    const checkConnection = () => {
      setIsConnected(socket.connected)
    }

    socket.on('connect', checkConnection)
    socket.on('disconnect', checkConnection)
    checkConnection()

    // Handle Gmail sync responses
    socket.on('gmail_sync_response', (data) => {
      if (data.success) {
        // Refresh emails after sync
        fetchEmails()
      }
      setSyncing(false)
    })

    // Handle email triage responses
    socket.on('email_triage_response', (data) => {
      // Add triaged email to inbox
      const newEmail: Email = {
        id: `email-${Date.now()}`,
        gmailId: `gmail-${Date.now()}`,
        sender: 'ai@orbitos.system',
        subject: `AI Analysis: ${data.category}`,
        preview: data.summary,
        category: data.category,
        urgency: data.urgency,
        suggested_action: data.suggested_action,
        timestamp: new Date().toISOString(),
        read: false,
        starred: false,
        aiProcessed: true
      }
      
      setEmails(prev => [newEmail, ...prev])
      setLoading(false)
    })

    // Handle email triage completion
    socket.on('email_triage_complete', (data) => {
      console.log('Email triage completed:', data)
      fetchEmails() // Refresh to show processed emails
    })

    // Handle auto-triage status updates
    socket.on('auto_triage_started', (data) => {
      setAutoTriageActive(true)
      console.log('Auto-triage started:', data.message)
    })

    socket.on('auto_triage_stopped', (data) => {
      setAutoTriageActive(false)
      console.log('Auto-triage stopped:', data.message)
    })

    socket.on('auto_triage_error', (data) => {
      console.error('Auto-triage error:', data.error)
      setAutoTriageActive(false)
    })

    // Load initial emails
    fetchEmails()

    return () => {
      socket.off('connect', checkConnection)
      socket.off('disconnect', checkConnection)
      socket.off('gmail_sync_response')
      socket.off('email_triage_response')
      socket.off('email_triage_complete')
      socket.off('auto_triage_started')
      socket.off('auto_triage_stopped')
      socket.off('auto_triage_error')
    }
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/gmail/emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails.map((email: any) => ({
          id: email.id,
          gmailId: email.gmailId,
          sender: email.from || 'Unknown',
          subject: email.subject || 'No Subject',
          preview: email.snippet || '',
          category: email.category || 'Follow-Up',
          urgency: email.urgency || 5,
          suggested_action: email.suggestedAction || 'Review',
          timestamp: email.received,
          read: email.read,
          starred: email.starred,
          aiProcessed: email.aiProcessed
        })))
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    }
  }

  const syncGmail = async () => {
    if (!isConnected || syncing) return

    setSyncing(true)
    socket.emit('gmail_sync_request', {
      userId: 'user-1', // In real app, get from auth
      maxResults: 10
    })
  }

  const triageEmail = (emailContent: string) => {
    if (!isConnected) return

    setLoading(true)
    socket.emit('email_triage_request', {
      emailContent,
      userId: 'user-1',
      recentEmails: emails.length
    })
  }

  const toggleAutoTriage = () => {
    if (!isConnected) return

    if (autoTriageActive) {
      socket.emit('stop_auto_triage', { userId: 'user-1' })
    } else {
      socket.emit('start_auto_triage', { 
        userId: 'user-1', 
        intervalMinutes: 5 
      })
    }
  }

  const handleQuickTriage = () => {
    const sampleEmails = [
      "Hey, can we push the demo to Thursday? Client needs more time.",
      "URGENT: Security vulnerability detected in production - immediate action required",
      "Thanks for the great presentation yesterday! Really enjoyed it.",
      "Special offer: 50% off all AI tools this week only!",
      "Meeting reminder: Quarterly review scheduled for tomorrow at 2 PM"
    ]
    
    const randomEmail = sampleEmails[Math.floor(Math.random() * sampleEmails.length)]
    triageEmail(randomEmail)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Priority': return 'destructive'
      case 'Action-Required': return 'default'
      case 'Follow-Up': return 'secondary'
      case 'Promo': return 'outline'
      case 'Noise': return 'outline'
      default: return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Priority': return <AlertTriangle className="w-4 h-4" />
      case 'Action-Required': return <Clock className="w-4 h-4" />
      case 'Follow-Up': return <Reply className="w-4 h-4" />
      case 'Promo': return <Star className="w-4 h-4" />
      case 'Noise': return <Archive className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 8) return 'text-red-600'
    if (urgency >= 6) return 'text-orange-600'
    if (urgency >= 4) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Smart Inbox
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {autoTriageActive && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-600">Auto-triage Active</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleAutoTriage}
                disabled={!isConnected}
              >
                {autoTriageActive ? '⏹️ Stop Auto' : '⚡ Auto Triage'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={syncGmail}
                disabled={!isConnected || syncing}
              >
                {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sync className="w-4 h-4" />}
                {syncing ? 'Syncing...' : 'Sync Gmail'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleQuickTriage}
                disabled={!isConnected || loading}
              >
                {loading ? 'Processing...' : 'Triage Sample'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Email List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-1">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No emails yet.</p>
                  <p className="text-sm">Click "Sync Gmail" to connect your inbox!</p>
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                      !email.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getCategoryColor(email.category) as any} className="text-xs">
                            {getCategoryIcon(email.category)}
                            <span className="ml-1">{email.category}</span>
                          </Badge>
                          <span className={`text-xs font-medium ${getUrgencyColor(email.urgency)}`}>
                            Urgency: {email.urgency}/10
                          </span>
                          {email.aiProcessed && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              AI Processed
                            </Badge>
                          )}
                          {!email.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{email.sender}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(email.timestamp)}
                          </span>
                        </div>
                        
                        <h4 className="text-sm font-medium mb-1 truncate">{email.subject}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {email.preview}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            💡 {email.suggestedAction}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm">
                          <Reply className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {emails.filter(e => e.category === 'Priority').length}
              </div>
              <div className="text-xs text-muted-foreground">Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {emails.filter(e => e.category === 'Action-Required').length}
              </div>
              <div className="text-xs text-muted-foreground">Action Required</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {emails.filter(e => e.category === 'Follow-Up').length}
              </div>
              <div className="text-xs text-muted-foreground">Follow Up</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {emails.filter(e => e.category === 'Promo').length}
              </div>
              <div className="text-xs text-muted-foreground">Promotions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {emails.filter(e => e.category === 'Noise').length}
              </div>
              <div className="text-xs text-muted-foreground">Noise</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center">
            <div className="text-lg font-bold text-green-600">
              {emails.filter(e => e.aiProcessed).length}/{emails.length}
            </div>
            <div className="text-xs text-muted-foreground">AI Processed</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}