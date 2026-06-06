import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get('next') || '/profile';
  
  const clientId = process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/roblox/callback`
    : 'https://assetspp.vercel.app/api/roblox/callback'; // Fallback to vercel

  if (!clientId) {
    return NextResponse.json({ error: 'Missing Roblox Client ID in env' }, { status: 500 });
  }

  // We can pass 'next' in the state parameter
  const state = encodeURIComponent(next);

  const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid profile&state=${state}`;

  return NextResponse.redirect(authUrl);
}
