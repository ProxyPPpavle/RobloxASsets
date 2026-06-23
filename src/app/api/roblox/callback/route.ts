import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/profile';
  const errorParam = searchParams.get('error');

  if (errorParam || !code) {
    return NextResponse.redirect(new URL('/profile?error=roblox_auth_failed', req.url));
  }

  const clientId = process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID;
  const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
  // HARDCODE to exactly match the Roblox Dashboard to avoid Vercel preview domain mismatches
  const redirectUri = 'https://assetspp.vercel.app/api/roblox/callback';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Roblox credentials in env' }, { status: 500 });
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://apis.roblox.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Token Error:', err);
      return NextResponse.redirect(new URL('/profile?error=token_exchange_failed', req.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch UserInfo
    const userRes = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL('/profile?error=userinfo_failed', req.url));
    }

    const userData = await userRes.json();
    const robloxId = userData.sub;
    const robloxUsername = userData.preferred_username || userData.name;

    // 3. Update Supabase Profile
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Not logged in to our site
      return NextResponse.redirect(new URL('/?error=must_login_first', req.url));
    }

    // Save to DB
    const { error: dbErr } = await supabase
      .from('profiles')
      .update({
        roblox_id: robloxId,
        roblox_username: robloxUsername
      })
      .eq('id', user.id);

    if (dbErr) {
      console.error('DB Update Error:', dbErr);
      return NextResponse.redirect(new URL('/profile?error=db_update_failed', req.url));
    }

    // Success! Redirect back.
    const redirectUrl = new URL(decodeURIComponent(state), req.url);
    redirectUrl.searchParams.set('success', 'roblox_linked');
    return NextResponse.redirect(redirectUrl);

  } catch (err) {
    console.error('OAuth Catch Error:', err);
    return NextResponse.redirect(new URL('/profile?error=internal_error', req.url));
  }
}
