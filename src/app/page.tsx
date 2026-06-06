import { createClient } from "@/utils/supabase/server";
import AppShell from "@/components/AppShell";
import FeedClient from "@/components/FeedClient";
import { sortFeedProducts } from "@/lib/feedSort";
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const getProducts = unstable_cache(
    async () => {
      const db = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await db
        .from("products")
        .select(
          `
          *,
          profiles ( username, avatar_url ),
          product_analytics ( views, clicks, likes ),
          product_monetization ( promoted, promoted_until ),
          product_customization (
            title_color,
            description_color,
            title_font,
            description_font,
            bg_color_or_image,
            bg_image_storage_url,
            border_style
          )
        `
        )
        .eq("approved", "approved");
      return data;
    },
    ["feed-products"],
    { revalidate: 30 }
  );

  const products = await getProducts();

  let likedProductIds: number[] = [];
  if (session?.user) {
    const { data: likes } = await supabase
      .from("product_likes")
      .select("product_id")
      .eq("user_id", session.user.id);
    likedProductIds = likes?.map((l) => l.product_id) ?? [];
  }

  const sorted = sortFeedProducts(products ?? []);

  return (
    <AppShell user={session?.user ?? null} isLoggedIn={!!session}>
      <FeedClient
        products={sorted}
        userId={session?.user?.id ?? null}
        initialLikedIds={likedProductIds}
      />
    </AppShell>
  );
}
