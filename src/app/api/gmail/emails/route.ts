import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserEmails } from '@/lib/gmail';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from cookie
    const cookieStore = cookies();
    const userId = cookieStore.get('orbit_user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get user emails
    const emails = await getUserEmails(userId, limit);

    return NextResponse.json({
      success: true,
      emails
    });

  } catch (error) {
    console.error('Get emails error:', error);
    return NextResponse.json(
      { error: 'Failed to get emails' },
      { status: 500 }
    );
  }
}