import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { removeProductStorageFiles } from "@/lib/removeProductStorage";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    // Temporary bypass for local admin testing
    // if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { productId, reason } = body;

    if (!productId || !reason) {
      return NextResponse.json({ success: false, error: "Product ID and reason are required" }, { status: 400 });
    }

    // Dobavi podatke o proizvodu da bismo znali kome šaljemo notifikaciju i sta brisemo
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select(
        `
        seller_id,
        title,
        image_url,
        file_url,
        product_customization ( bg_image_storage_url )
      `
      )
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const customization = Array.isArray(product.product_customization)
      ? product.product_customization[0]
      : product.product_customization;

    await removeProductStorageFiles(
      product.image_url,
      product.file_url,
      [customization?.bg_image_storage_url]
    );

    // Obrisi iz baze zauvek umesto postavljanja na blocked
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 400 });
    }

    // Pošalji notifikaciju kreatoru na engleskom
    const { error: notifError } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: product.seller_id,
          title: "Product Rejected",
          message: `Your product "${product.title}" has been rejected. Reason: ${reason}`,
          is_read: false
        }
      ]);

    if (notifError) {
      console.error("Failed to insert notification:", notifError);
    }

    return NextResponse.json({ success: true, message: "Product rejected and notification sent" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
