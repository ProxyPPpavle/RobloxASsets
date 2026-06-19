"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User | null; role?: string }) {
  return (
    <header className="fixed top-8 left-5 md:top-10 md:left-8 z-40 flex items-center gap-3 pointer-events-none">
      <Link
        href="/"
        className="flex items-center gap-2.5 cursor-pointer group pointer-events-auto"
      >
        <img 
          src="/LogoAssetsPP.png" 
          alt="AssetsPP Logo" 
          className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-all duration-300 [filter:drop-shadow(0_4px_14px_rgba(15,23,42,0.55))_drop-shadow(0_0_12px_rgba(59,130,246,0.45))]" 
        />
        <span className="text-lg md:text-xl font-display font-bold text-white tracking-tight drop-shadow-sm">
          Assets<span className="text-blue-500 font-extrabold">PP</span>
        </span>
      </Link>
    </header>
  );
}
