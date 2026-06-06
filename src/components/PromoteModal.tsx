"use client";

import { useState } from "react";
import { X, Flame } from "lucide-react";

const PROMO_PLANS = [
  { days: 1, label: "Starter", hint: "+1 day boost" },
  { days: 2, label: "Bronze", hint: "+2 days boost" },
  { days: 3, label: "Silver", hint: "+3 days boost" },
  { days: 4, label: "Gold", hint: "+4 days boost" },
  { days: 5, label: "Platinum", hint: "+5 days boost" },
  { days: 6, label: "Elite", hint: "+6 days boost" },
] as const;

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
  const [loadingDays, setLoadingDays] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (days: number) => {
    setLoadingDays(days);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
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
      setLoadingDays(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-[#151b2d] border border-amber-900/40 rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(245,158,11,0.12)] overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Flame className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Promote asset</span>
            </div>
            <h3 className="text-lg font-extrabold text-white leading-tight">
              {productTitle || "Your listing"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pick a plan — each option adds promotion days. Payment links coming soon.
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

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PROMO_PLANS.map((plan) => (
            <button
              key={plan.days}
              type="button"
              disabled={loadingDays !== null}
              onClick={() => handleSelect(plan.days)}
              className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-slate-700 bg-[#111625] hover:border-amber-500/60 hover:bg-amber-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
            >
              <span className="text-2xl font-black text-amber-400">{plan.days}d</span>
              <span className="text-xs font-bold text-white">{plan.label}</span>
              <span className="text-[10px] text-slate-500">{plan.hint}</span>
              <span className="text-[10px] font-mono text-slate-400 mt-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Pay — R$
              </span>
              {loadingDays === plan.days && (
                <span className="text-[10px] text-amber-400 animate-pulse">Applying…</span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <p className="px-5 pb-4 text-xs text-rose-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
