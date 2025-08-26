'use client';

import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, User } from 'lucide-react';

export function ConnectGmailButton() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }
  
  if (!session) {
    return (
      <Button 
        onClick={() => signIn('google')}
        className="bg-white text-gray-700 hover:bg-gray-50 border"
      >
        <Mail className="mr-2 h-4 w-4" />
        Connect Gmail
      </Button>
    );
  }
  
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {session.user?.image ? (
          <img 
            src={session.user.image} 
            alt={session.user.name || 'User'}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {session.user?.name || 'User'}
        </span>
        <span className="text-xs text-gray-500">
          {session.user?.email}
        </span>
      </div>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="ml-1 text-xs text-green-600">Connected</span>
      </div>
    </div>
  );
}