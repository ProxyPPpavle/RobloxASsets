"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";
import { LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Navbar({ user }: { user: User | null; role?: string }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [clientUser, setClientUser] = useState<User | null>(user);
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    if (user) {
      setClientUser(user);
      setIsLoading(false);
    } else {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setClientUser(data.user);
        setIsLoading(false);
      });
    }
  }, [user]);

  return (
    <>
      <header className="fixed top-8 left-5 md:top-10 md:left-8 z-40 flex items-center gap-3 pointer-events-none">
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-pointer group pointer-events-auto"
        >
          <img 
            src="/LogoAssetsPP.png" 
            alt="AssetsPP Logo" 
            className="w-14 h-14 md:w-16 md:h-16 object-contain group-hover:scale-105 transition-all duration-300 [filter:drop-shadow(0_4px_14px_rgba(15,23,42,0.8))_drop-shadow(0_0_15px_rgba(59,130,246,0.8))]" 
          />
          <span className="text-lg md:text-xl font-display font-bold text-white tracking-tight drop-shadow-sm">
            Assets<span className="text-blue-500 font-extrabold">PP</span>
          </span>
        </Link>
{isLoading ? (
  <div className="flex items-center gap-2 ml-1">
    <div className="animate-pulse bg-slate-700 h-8 w-20 rounded" />
  </div>
) : clientUser ? (
  <Link href="/profile" className="ml-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-sm text-white hover:bg-slate-700 transition-colors">
    <span className="font-medium">{clientUser.email?.split('@')[0] ?? 'Profile'}</span>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196" /></svg>
  </Link>
) : (
  <div className="flex items-center gap-2 pointer-events-auto ml-1">
    <button
      type="button"
      onClick={() => setAuthModalOpen(true)}
      className="text-xs font-sans text-white font-bold bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-1 cursor-pointer"
    >
      <LogIn className="w-3.5 h-3.5" />
      Sign In
    </button>
    <a
      href="/api/roblox/auth?next=/"
      className="text-xs font-sans text-white font-bold bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-1 cursor-pointer"
    >
      CONTINUE WITH ROBLOX OAUTH
    </a>
  </div>
)}
      </header>

      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </>
  );
}
