


import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import AppShell from "@/components/AppShell";
import ProfileClient from "@/components/ProfileClient";
import Auth from "@/components/Auth";
import RobloxVerifyModal from "@/components/RobloxVerifyModal";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <AppShell isLoggedIn={false}>
        <div className="flex items-center justify-center min-h-[50vh] py-8">
          <Auth />
        </div>
      </AppShell>
    );
  }

  const adminDb = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await adminDb
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: products } = await adminDb
    .from("products")
    .select(
      `
      *,
      profiles ( username, avatar_url ),
      product_analytics ( views, clicks, likes ),
      product_monetization ( promoted, promoted_until )
    `
    )
    .eq("seller_id", session.user.id)
    .neq("approved", "blocked")
    .order("created_at", { ascending: false });

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <AppShell user={session.user} isLoggedIn wide>
      <ProfileClient
        profile={{
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          roblox_id: profile?.roblox_id,
        }}
        email={session.user.email ?? ""}
        memberSince={new Date(
          profile?.created_at || session.user.created_at
        ).toLocaleDateString()}
        initialProducts={products ?? []}
        initialNotifications={notifications ?? []}
      />
    </AppShell>
  );
}
