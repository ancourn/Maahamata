import { googleAuthUrl } from '@/lib/auth/google';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const redirect = request.nextUrl.searchParams.get('redirect') || '/';
  const url = new URL(googleAuthUrl);
  url.searchParams.set('state', redirect);
  return Response.redirect(url.toString());
}