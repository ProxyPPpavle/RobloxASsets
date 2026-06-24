import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { fetchRobloxPriceFromLink } from "@/lib/roblox";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("seller_id, title, gamepass_link, price")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let verifiedPrice = product.price ?? 0;

    if (product.gamepass_link) {
      const robloxPrice = await fetchRobloxPriceFromLink(product.gamepass_link);
      if (robloxPrice === null) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Could not verify Roblox gamepass price. Check the link is valid and the pass is on sale.",
          },
          { status: 400 }
        );
      }
      verifiedPrice = robloxPrice;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ approved: "approved", price: verifiedPrice })
      .eq("id", productId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await adminDb.from("notifications").insert({
      user_id: product.seller_id,
      title: "Product Approved",
      message:
        verifiedPrice > 0
          ? `Your product "${product.title}" is live at R$ ${verifiedPrice}.`
          : `Your product "${product.title}" is now live on the marketplace.`,
      is_read: false,
    });

    revalidateTag("feed-products", { expire: 0 });

    return NextResponse.json({
      success: true,
      message: "Product approved",
      price: verifiedPrice,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
