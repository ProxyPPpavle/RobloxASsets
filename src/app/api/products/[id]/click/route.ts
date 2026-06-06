import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: idParam } = await params;
  const productId = parseInt(idParam, 10);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const { data: analytics, error: fetchErr } = await supabase
      .from('product_analytics')
      .select('clicks')
      .eq('product_id', productId)
      .maybeSingle();

    if (fetchErr) {
      console.error(fetchErr);
      return NextResponse.json({ success: false, error: fetchErr.message }, { status: 400 });
    }

    if (!analytics) {
      // Ako ne postoji, ubacujemo
      await supabase
        .from('product_analytics')
        .insert({ product_id: productId, clicks: 1 });
    } else {
      await supabase
        .from('product_analytics')
        .update({ clicks: analytics.clicks + 1 })
        .eq('product_id', productId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
