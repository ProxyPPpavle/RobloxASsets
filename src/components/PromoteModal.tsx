"use client";

import { useState } from "react";
import { X, Flame, ExternalLink } from "lucide-react";

export default function PromoteModal({
  productId,
  productTitle,
  onClose,
  onPromoted,
}: {
  productId: number;
  productTitle?: string;
  onClose: () => void;
  onPromoted?: (promotedUntil: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePromote = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: In the future, this endpoint will check the Roblox API 
      // to verify if the user actually owns the gamepass before promoting.
      const res = await fetch(`/api/products/${productId}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 1 }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Promotion failed");
        return;
      }
      onPromoted?.(data.promoted_until);
      onClose();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-[#151b2d] border border-blue-900/40 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(37,99,235,0.12)] overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Flame className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Promote asset</span>
            </div>
            <h3 className="text-lg font-extrabold text-white leading-tight">
              {productTitle || "Your listing"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Boost your asset visibility for 1 day.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-4 text-center">
            <h4 className="text-white font-bold mb-2">Step 1: Purchase Gamepass</h4>
            <p className="text-xs text-slate-400 mb-4">
              To promote your asset, you must purchase the 1-Day Promote Gamepass on Roblox.
            </p>
            <a 
              href="https://www.roblox.com/game-pass/1405763143/400rbx" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#13192b] hover:bg-slate-800 border border-slate-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Buy Gamepass (400 R$) <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="text-center space-y-3">
            <h4 className="text-white font-bold">Step 2: Verify & Activate</h4>
            <p className="text-xs text-slate-400">
              Already bought it? Click below to verify your purchase and activate the promotion.
              <br/><br/>
              <span className="text-amber-400 font-semibold block">⚠️ Promoted content has special priority in the feed!</span>
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={handlePromote}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              {loading ? "Verifying..." : "Verify Purchase & Promote"}
            </button>
          </div>
        </div>

        {error && (
          <p className="px-5 pb-4 text-xs text-rose-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
