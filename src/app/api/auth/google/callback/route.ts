import { client } from '@/lib/auth/google';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state') || '/';
  
  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    const { tokens } = await client.getToken(code);
    
    // Get user info
    const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    }).then(res => res.json());

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email: userInfo.email },
      update: {
        name: userInfo.name,
        avatar: userInfo.picture,
        googleTokens: tokens,
      },
      create: {
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        googleTokens: tokens,
      },
    });

    // Set auth cookie
    cookies().set('orbit_user_id', user.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 
    });

    return Response.redirect(new URL(state, request.url));
  } catch (error) {
    console.error('Auth error:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}