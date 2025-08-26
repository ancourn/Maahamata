import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { syncUserEmails } from '@/lib/gmail';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from cookie
    const cookieStore = cookies();
    const userId = cookieStore.get('orbit_user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { maxResults = 10 } = await request.json();

    // Sync emails from Gmail
    const emails = await syncUserEmails(userId, maxResults);

    return NextResponse.json({
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

  } catch (error) {
    console.error('Gmail sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync emails' },
      { status: 500 }
    );
  }
}