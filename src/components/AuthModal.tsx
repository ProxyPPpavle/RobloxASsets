"use client";

import Auth from "./Auth";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-[#161b22] border border-[#30363d] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#30363d] transition-colors z-10"
        >
          ✕
        </button>
        <Auth />
      </div>
    </div>
  );
}
