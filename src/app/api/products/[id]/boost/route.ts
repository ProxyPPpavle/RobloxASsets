import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Rucno proveravamo da li vec postoji lajk za ovog korisnika i proizvod, jer UNIQUE constraint mozda nije podesen u Supabase-u
    const { data: existingLike } = await supabase
      .from('product_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', parseInt(id))
      .maybeSingle();

    let likeIncrement = 0;

    if (existingLike) {
      // Vec je lajkovano, znaci brisemo (unlike)
      await supabase
        .from('product_likes')
        .delete()
        .match({ user_id: user.id, product_id: parseInt(id) });
      
      likeIncrement = -1;
    } else {
      // Nije lajkovano, ubacujemo (like)
      const { error: insertError } = await supabase
        .from('product_likes')
        .insert({ user_id: user.id, product_id: parseInt(id) });
      
      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 400 });
      }
      likeIncrement = 1;
    }

    const productId = parseInt(id, 10);

    const { data: analytics, error: fetchErr } = await supabase
      .from('product_analytics')
      .select('likes')
      .eq('product_id', productId)
      .maybeSingle();

    if (!analytics) {
      await supabase
        .from('product_analytics')
        .insert({ product_id: productId, likes: Math.max(0, likeIncrement) });
    } else {
      const newLikesCount = Math.max(0, analytics.likes + likeIncrement);
      await supabase
        .from('product_analytics')
        .update({ likes: newLikesCount })
        .eq('product_id', productId);
    }

    return NextResponse.json({ success: true, action: likeIncrement > 0 ? 'liked' : 'unliked' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
