import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";
import type { User } from "@supabase/supabase-js";

export default function AppShell({
  children,
  user = null,
  isLoggedIn = false,
  wide = false,
}: {
  children: React.ReactNode;
  user?: User | null;
  isLoggedIn?: boolean;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-transparent text-white font-sans flex flex-col">
      <Navbar user={user} />
      <div className="flex-1 pt-14 md:pt-16 pb-8">
        <div className={`${wide ? "max-w-7xl" : "max-w-6xl"} mx-auto px-4 md:px-6`}>
          {children}
        </div>
      </div>
      <SiteFooter />
      <BottomNav isLoggedIn={isLoggedIn} />
    </div>
  );
}
