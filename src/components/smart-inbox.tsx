'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConnectGmailButton } from './connect-gmail-button';
import { 
  Mail, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Info,
  Trash2,
  Archive,
  Reply,
  Loader2
} from 'lucide-react';

type Email = {
  id: string;
  from: string;
  subject: string;
  body: string;
  category: string;
  urgency: number;
  suggestedAction: string;
  confidence: number;
  processedAt: string;
  createdAt: string;
};

export function SmartInbox() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (session) {
      // Initialize socket connection
      const socketInstance = io({
        path: '/api/socketio',
      });
      
      setSocket(socketInstance);

      // Fetch initial emails
      fetchEmails();

      // Listen for new triaged emails
      socketInstance.on('new_email_triage', (data) => {
        setEmails(prev => prev.map(email => 
          email.id === data.emailId ? { ...email, ...data.triage } : email
        ));
      });

      return () => {
        socketInstance.disconnect();
      };
    } else {
      // Clear emails when not authenticated
      setEmails([]);
      setLoading(false);
    }
  }, [session]);

  const fetchEmails = async () => {
    if (!session) return;
    
    try {
      const response = await fetch('/api/emails');
      const data = await response.json();
      setEmails(data.emails || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!session) return;
    
    setSyncing(true);
    try {
      const response = await fetch('/api/sync-emails', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Fetch updated emails
        await fetchEmails();
      } else {
        console.error('Sync failed:', data.error);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Priority':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Action-Required':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Informational':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Follow-Up':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Spam':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Priority':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Action-Required':
        return <CheckCircle className="h-4 w-4" />;
      case 'Informational':
        return <Info className="h-4 w-4" />;
      case 'Follow-Up':
        return <Clock className="h-4 w-4" />;
      case 'Spam':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 8) return 'text-red-600';
    if (urgency >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (status === 'loading') {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading authentication...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Smart Inbox
          </CardTitle>
          <CardDescription>
            AI-powered email triage and management
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connect Your Gmail Account
          </h3>
          <p className="text-gray-500 mb-6">
            Connect your Gmail account to start using AI-powered email management
          </p>
          <ConnectGmailButton />
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading inbox...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Smart Inbox
            </CardTitle>
            <CardDescription>
              AI-powered email triage and management
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <ConnectGmailButton />
            <Button 
              onClick={handleSync} 
              disabled={syncing}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Inbox'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full">
          {emails.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No emails found</p>
              <p className="text-sm text-gray-400 mt-2">
                Click "Sync Inbox" to fetch and triage your emails
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div 
                  key={email.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={getCategoryColor(email.category)}
                        >
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(email.category)}
                            {email.category}
                          </div>
                        </Badge>
                        <span className={`text-sm font-medium ${getUrgencyColor(email.urgency)}`}>
                          Urgency: {email.urgency}/10
                        </span>
                        <span className="text-xs text-gray-500">
                          {(email.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">
                        {email.subject}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        From: {email.from}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {new Date(email.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {email.body}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Archive className="h-3 w-3 mr-1" />
                        Archive
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {email.suggestedAction}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}