"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Plus, User } from "lucide-react";
import UploadModal from "./UploadModal";
import AuthModal from "./AuthModal";

export default function BottomNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    setUploadOpen(true);
  };

  const feedActive = pathname === "/";
  const profileActive = pathname === "/profile";

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl bg-[#090C15]/95 border border-gray-800 shadow-2xl backdrop-blur-md">
          <div className="py-2 px-4 flex items-center justify-between gap-6 font-sans">
            <Link
              href="/"
              className={`px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 uppercase transition-all duration-150 rounded-xl ${
                feedActive
                  ? "text-white bg-blue-600 border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Feed</span>
            </Link>

            <button
              type="button"
              onClick={handleUploadClick}
              className="w-10 h-10 rounded-full bg-[#10B981] hover:bg-[#34D399] text-black flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.45)]"
              title={isLoggedIn ? "Upload asset" : "Sign in to upload"}
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>

            <Link
              href="/profile"
              className={`px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 uppercase transition-all duration-150 rounded-xl ${
                profileActive
                  ? "text-white bg-blue-600 border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>Profile</span>
              <User className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {uploadOpen && (
        <UploadModal
          onClose={() => {
            setUploadOpen(false);
            router.refresh();
          }}
        />
      )}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
