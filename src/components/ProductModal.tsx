"use client";

import { useState } from "react";
import { trackProductClickDebounced } from "@/lib/productEngagement";
import { syncProductLike } from "@/lib/syncLike";
import { motion } from "motion/react";
import {
  X,
  Eye,
  ThumbsUp,
  MousePointerClick,
  ExternalLink,
  DownloadCloud,
  CheckCircle,
  Flame,
} from "lucide-react";
import { isProductPromoted } from "@/lib/feedSort";

export default function ProductModal({
  product,
  onClose,
  userId,
  hasLiked = false,
  onLikeToggle,
  onRequireAuth,
}: {
  product: {
    id: number | string;
    title?: string;
    description?: string | null;
    price?: number;
    image_url?: string;
    file_url?: string;
    gamepass_link?: string | null;
    profiles?: { username?: string } | null;
    product_analytics?: { views?: number; clicks?: number; likes?: number } | null;
    product_monetization?: { promoted?: boolean; promoted_until?: string | null } | null;
  };
  onClose: () => void;
  userId?: string | null;
  hasLiked?: boolean;
  onLikeToggle?: (id: number | string, action: "liked" | "unliked") => void;
  onRequireAuth?: () => void;
}) {
  const [downloadDone, setDownloadDone] = useState(false);
  const [liked, setLiked] = useState(hasLiked);
  const [likes, setLikes] = useState(product.product_analytics?.likes ?? 0);
  const [checkingOwnership, setCheckingOwnership] = useState(false);

  const isFree = (product.price ?? 0) === 0;

  const trackClick = () => {
    trackProductClickDebounced(product.id);
  };

  const handleDownloadAction = () => {
    if (downloadDone) return;
    trackClick();
    if (product.file_url) {
      window.open(product.file_url, "_blank");
      setDownloadDone(true);
    }
  };

  const handleBuyAction = async () => {
    // If user is not authenticated (no userId), prompt auth flow
    if (!userId) {
      console.log('Triggering auth flow');
      onRequireAuth?.();
      return;
    }
    trackClick();
    
    if (product.gamepass_link) {
      const match = product.gamepass_link.match(/game-pass\/(\d+)/);
      const gamepassId = match ? match[1] : null;

      if (gamepassId) {
        setCheckingOwnership(true);
        try {
          const res = await fetch(`/api/roblox/check-gamepass?gamepassId=${gamepassId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.owns) {
              setCheckingOwnership(false);
              if (product.file_url) {
                window.open(product.file_url, "_blank");
                setDownloadDone(true);
              } else {
                alert("You own this gamepass, but no file is available for download.");
              }
              return;
            }
          } else if (res.status === 403) {
            // Need to verify Roblox account
            setCheckingOwnership(false);
            onRequireAuth?.();
            return;
          }
        } catch (e) {
          console.error('Ownership check failed:', e);
        }
        setCheckingOwnership(false);
      }

      window.open(product.gamepass_link, "_blank", "noreferrer");
    }
  };

  const handleLike = () => {
    if (!userId) {
      onRequireAuth?.();
      return;
    }

    const wasLiked = liked;
    const optimistic: "liked" | "unliked" = wasLiked ? "unliked" : "liked";
    const inc = optimistic === "liked" ? 1 : -1;

    setLiked(optimistic === "liked");
    setLikes((l) => Math.max(0, l + inc));
    onLikeToggle?.(product.id, optimistic);

    syncProductLike(product.id).then((serverAction) => {
      if (!serverAction) {
        setLiked(wasLiked);
        setLikes((l) => Math.max(0, l - inc));
        onLikeToggle?.(product.id, wasLiked ? "liked" : "unliked");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-[#13192b] border border-blue-500/40 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(37,99,235,0.2)] my-8 grid grid-cols-1 md:grid-cols-12 text-gray-200"
      >
        <div className="md:col-span-7 min-h-[360px] md:min-h-[480px] h-full relative overflow-hidden flex flex-col justify-between p-5 border-b md:border-b-0 md:border-r border-slate-800 bg-[#13192b]">
          <div className="relative z-10 flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-black/80 backdrop-blur-md border border-white/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                ASSET PREVIEW
              </span>
              {isProductPromoted(product) && (
                <span className="text-[9px] bg-amber-950/60 backdrop-blur-md border border-amber-900/50 text-amber-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Flame className="w-3 h-3" /> HOT
                </span>
              )}
            </div>
          </div>

          <div className="my-auto py-3 relative z-10 w-full flex items-center justify-center">
            <div className="w-full max-h-[290px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative border border-blue-500/40">
              <img
                src={product.image_url}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full min-h-[200px] max-h-[290px] object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
          </div>

          <div className="relative z-10 mt-3 p-3.5 bg-black/75 border border-white/5 rounded-xl space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tight flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-gray-400" /> Views
                </span>
                <p className="text-xs font-mono font-bold text-gray-300 mt-1">
                  {product.product_analytics?.views ?? 0}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tight flex items-center justify-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-gray-400" /> Clicks
                </span>
                <p className="text-xs font-mono font-bold text-gray-300 mt-1">
                  {product.product_analytics?.clicks ?? 0}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLike}
                className="p-2 rounded-lg bg-pink-950/15 border border-pink-500/20 hover:bg-pink-950/30 transition-colors cursor-pointer"
              >
                <span className="text-[9px] font-mono uppercase tracking-tight flex items-center justify-center gap-1 text-pink-400 font-bold">
                  <ThumbsUp
                    className={`w-3.5 h-3.5 ${liked ? "fill-pink-500 text-pink-400" : "text-pink-400"}`}
                  />
                  Like
                </span>
                <p className="text-xs font-mono font-bold text-pink-400 mt-1">{likes}</p>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-[#111625]">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[11px] font-mono font-extrabold text-white">
                  {(product.profiles?.username || "dev").substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-gray-400 font-extrabold">
                    @{product.profiles?.username || "creator"}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">Creator</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h1 className="text-lg font-display font-black tracking-tight text-white leading-tight">
                {product.title}
              </h1>
              <p className="text-xs text-gray-300 leading-relaxed max-h-[180px] overflow-y-auto pr-1">
                {product.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            {isFree ? (
              <button
                type="button"
                onClick={handleDownloadAction}
                className="w-full py-3 bg-white hover:bg-gray-100 text-black rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                {downloadDone ? (
                  <>
                    <CheckCircle className="w-4.5 h-4.5 text-black" />
                    Downloaded (.rbxm)
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4.5 h-4.5" />
                    Download (.rbxm)
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBuyAction}
                disabled={checkingOwnership}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>
                  {checkingOwnership ? "Checking..." : `Buy for R$ ${product.price} Robux`}
                </span>
                {!checkingOwnership && <ExternalLink className="w-4 h-4 text-white" />}
              </button>
            )}
            <p className="text-[10px] text-gray-500 text-center mt-3 font-mono">
              Buy And let us confirm transaction! Your assets will be in inbox
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
