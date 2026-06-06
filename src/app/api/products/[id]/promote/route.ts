import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const productId = parseInt((await params).id, 10);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .maybeSingle();

  if (!product || product.seller_id !== user.id) {
    return NextResponse.json({ success: false, error: "Not your product" }, { status: 403 });
  }

  const body = await req.json();
  const days = Math.min(30, Math.max(1, Number(body.days) || 1));

  const { data: monetization } = await supabase
    .from("product_monetization")
    .select("promoted_until")
    .eq("product_id", productId)
    .maybeSingle();

  const now = Date.now();
  const existingUntil = monetization?.promoted_until
    ? new Date(monetization.promoted_until).getTime()
    : 0;
  const base = existingUntil > now ? new Date(existingUntil) : new Date();
  base.setDate(base.getDate() + days);
  const promotedUntil = base.toISOString();

  const { error } = await supabase.from("product_monetization").upsert(
    {
      product_id: productId,
      promoted: true,
      promoted_until: promotedUntil,
    },
    { onConflict: "product_id" }
  );

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, promoted_until: promotedUntil });
}
