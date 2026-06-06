import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const productId = parseInt((await params).id, 10);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }

  const { data: analytics } = await supabase
    .from("product_analytics")
    .select("views")
    .eq("product_id", productId)
    .maybeSingle();

  if (!analytics) {
    await supabase
      .from("product_analytics")
      .insert({ product_id: productId, views: 1 });
  } else {
    await supabase
      .from("product_analytics")
      .update({ views: analytics.views + 1 })
      .eq("product_id", productId);
  }

  return NextResponse.json({ success: true });
}
