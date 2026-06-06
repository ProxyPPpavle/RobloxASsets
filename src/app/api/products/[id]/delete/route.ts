import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { removeProductStorageFiles } from "@/lib/removeProductStorage";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select(
        `
        seller_id,
        image_url,
        file_url,
        product_customization ( bg_image_storage_url )
      `
      )
      .eq("id", id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    if (product.seller_id !== user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const customization = Array.isArray(product.product_customization)
      ? product.product_customization[0]
      : product.product_customization;

    const storageResult = await removeProductStorageFiles(
      product.image_url,
      product.file_url,
      [customization?.bg_image_storage_url]
    );

    // Manual cascade deletes
    await supabase.from("product_likes").delete().eq("product_id", id);
    await supabase.from("product_analytics").delete().eq("product_id", id);
    await supabase.from("product_monetization").delete().eq("product_id", id);
    await supabase.from("product_customization").delete().eq("product_id", id);

    const { error: deleteError } = await supabase.from("products").delete().eq("id", id);

    if (deleteError) {
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted",
      storageRemoved: storageResult.ok,
      storageWarning: storageResult.ok ? undefined : storageResult.error,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
