"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import AuthModal from "./AuthModal";
import { LogIn } from "lucide-react";

export default function Navbar({ user }: { user: User | null; role?: string }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
            className="w-10 h-10 md:w-11 md:h-11 object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
          />
          <span className="text-lg md:text-xl font-display font-bold text-white tracking-tight drop-shadow-sm">
            Assets<span className="text-blue-500 font-extrabold">PP</span>
          </span>
        </Link>

        {!user && (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="pointer-events-auto text-xs font-sans text-white font-bold bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-1 cursor-pointer ml-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        )}
      </header>

      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </>
  );
}
