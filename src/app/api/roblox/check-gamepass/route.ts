import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gamepassId = searchParams.get('gamepassId');

  if (!gamepassId) {
    return NextResponse.json({ error: 'Missing gamepassId' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('roblox_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.roblox_id) {
    return NextResponse.json({ error: 'No Roblox account linked' }, { status: 403 });
  }

  try {
    const res = await fetch(`https://inventory.roblox.com/v1/users/${profile.roblox_id}/items/GamePass/${gamepassId}/is-owned`, {
      method: 'GET'
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to verify with Roblox' }, { status: 502 });
    }

    const isOwnedText = await res.text();
    const isOwned = isOwnedText.trim() === 'true';

    return NextResponse.json({ owns: isOwned });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
