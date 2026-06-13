"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import {
  trackProductView,
  trackProductClickDebounced,
} from "@/lib/productEngagement";
import { searchProducts } from "@/lib/productSearch";
import { partitionFeedProducts } from "@/lib/feedLayout";
import { isProductPromoted } from "@/lib/feedSort";
import { syncProductLike } from "@/lib/syncLike";
import { Search, Compass, Eye, ThumbsUp, Flame } from "lucide-react";
import ProductModal from "./ProductModal";
import AuthModal from "./AuthModal";
import RobloxVerifyModal from "./RobloxVerifyModal";

type FeedProduct = {
  id: number | string;
  title?: string;
  description?: string | null;
  price?: number;
  category?: string;
  image_url?: string;
  file_url?: string;
  gamepass_link?: string | null;
  created_at: string;
  profiles?: { username?: string; avatar_url?: string } | null;
  product_analytics?: { views?: number; clicks?: number; likes?: number } | null;
  product_monetization?: { promoted?: boolean; promoted_until?: string | null } | null;
  product_customization?: {
    title_color?: string;
    description_color?: string;
    bg_color_or_image?: string;
    bg_image_storage_url?: string | null;
  } | null;
  styles?: Record<string, string>;
};

function cardTheme(asset: FeedProduct) {
  const c = asset.product_customization;
  const s = asset.styles ?? {};
  return {
    bg:
      c?.bg_image_storage_url ||
      c?.bg_color_or_image ||
      (s.bgColor as string) ||
      "#13192b",
    titleColor: c?.title_color || (s.titleColor as string) || "#FFFFFF",
    descColor: c?.description_color || (s.descriptionColor as string) || "#94A3B8",
  };
}

const GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

export default function FeedClient({
  products,
  userId,
  initialLikedIds = [],
}: {
  products: FeedProduct[];
  userId: string | null;
  initialLikedIds?: number[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "top" | "free" | "paid">("newest");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedProduct, setSelectedProduct] = useState<FeedProduct | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [showRobloxVerify, setShowRobloxVerify] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(
    () => new Set(initialLikedIds.map(String))
  );
  const [localProducts, setLocalProducts] = useState(products);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const bumpAnalytics = useCallback(
    (id: string | number, field: "views" | "clicks") => {
      setLocalProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          return {
            ...p,
            product_analytics: {
              ...p.product_analytics,
              [field]: (p.product_analytics?.[field] ?? 0) + 1,
            },
          };
        })
      );
    },
    []
  );

  const recordClick = (id: string | number) => {
    trackProductClickDebounced(id, () => bumpAnalytics(id, "clicks"));
  };

  const openProduct = (asset: FeedProduct) => {
    setSelectedProduct(asset);
    recordClick(asset.id);
  };

  const applyLikeState = useCallback((id: string, action: "liked" | "unliked") => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (action === "liked") next.add(id);
      else next.delete(id);
      return next;
    });
    setLocalProducts((prev) =>
      prev.map((p) => {
        if (String(p.id) !== id) return p;
        const inc = action === "liked" ? 1 : -1;
        return {
          ...p,
          product_analytics: {
            ...p.product_analytics,
            likes: Math.max(0, (p.product_analytics?.likes ?? 0) + inc),
          },
        };
      })
    );
  }, []);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!userId) {
      setAuthOpen(true);
      return;
    }

    const wasLiked = likedIds.has(id);
    const optimisticAction: "liked" | "unliked" = wasLiked ? "unliked" : "liked";
    applyLikeState(id, optimisticAction);

    syncProductLike(id).then((serverAction) => {
      if (!serverAction) {
        applyLikeState(id, wasLiked ? "liked" : "unliked");
        return;
      }
      if (serverAction !== optimisticAction) {
        applyLikeState(id, serverAction);
      }
    });
  };

  const handleSortClick = (id: "newest" | "top" | "free" | "paid") => {
    if (sortBy === id) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(id);
      setSortDirection(id === "paid" ? "asc" : "desc");
    }
  };

  const { finalFeed, hasAny } = useMemo(() => {
    const categoryFiltered = localProducts.filter(
      (item) => categoryFilter === "All" || item.category === categoryFilter
    );
    const searched = searchProducts(categoryFiltered, searchQuery);
    const { promoted, regular } = partitionFeedProducts(
      searched,
      sortBy,
      sortDirection
    );

    const interleave = (assets: FeedProduct[]) => {
      const newest = [...assets].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const popular = [...assets].sort((a,b) => (b.product_analytics?.likes || 0) - (a.product_analytics?.likes || 0));
      const res: FeedProduct[] = [];
      const used = new Set<string>();
      let nIdx = 0; let pIdx = 0;
      while(used.size < assets.length) {
        let addedN = 0;
        while(addedN < 2 && nIdx < newest.length) {
          const p = newest[nIdx++];
          if(!used.has(String(p.id))) { res.push(p); used.add(String(p.id)); addedN++; }
        }
        let addedP = 0;
        while(addedP < 2 && pIdx < popular.length) {
          const p = popular[pIdx++];
          if(!used.has(String(p.id))) { res.push(p); used.add(String(p.id)); addedP++; }
        }
      }
      return res;
    };

    const regMixed = interleave(regular);
    const proMixed = interleave(promoted);

    const feed: FeedProduct[] = [];
    let r = 0; let p = 0;
    let isPromotedRow = false;
    
    while(r < regMixed.length || p < proMixed.length) {
      if(isPromotedRow) {
        if(p < proMixed.length) {
          feed.push(...proMixed.slice(p, p + 4));
          p += 4;
        }
        isPromotedRow = false;
      } else {
        if(r < regMixed.length) {
          feed.push(...regMixed.slice(r, r + 4));
          r += 4;
        }
        isPromotedRow = true;
      }
    }

    return {
      finalFeed: feed,
      hasAny: feed.length > 0
    };
  }, [localProducts, searchQuery, categoryFilter, sortBy, sortDirection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-product-id");
          if (!id) continue;
          const recorded = trackProductView(id, () => bumpAnalytics(id, "views"));
          if (recorded) observer.unobserve(entry.target);
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" }
    );

    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [bumpAnalytics, finalFeed]);

  const renderCard = (asset: FeedProduct) => {
    const id = String(asset.id);
    const hasLiked = likedIds.has(id);
    const theme = cardTheme(asset);
    const promoted = isProductPromoted(asset);
    const isFree = (asset.price ?? 0) === 0;

    const likes = asset.product_analytics?.likes || 0;
    const clicks = asset.product_analytics?.clicks || 1; // avoid division by zero
    const isGoated = likes >= 5 && (likes / clicks) > 0.05;

    return (
      <motion.div
        key={asset.id}
        ref={(el) => {
          if (el) cardRefs.current.set(id, el);
          else cardRefs.current.delete(id);
        }}
        data-product-id={id}
        layoutId={`asset-card-layout-${asset.id}`}
        onClick={() => openProduct(asset)}
        className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col relative select-none isolate border border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]"
        style={{
          backgroundColor: theme.bg.startsWith("http") ? "#13192b" : theme.bg,
          backgroundImage: theme.bg.startsWith("http") ? `url(${theme.bg})` : undefined,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {isGoated && (
            <span className="text-[10px] font-sans font-black px-2 py-1 rounded-lg uppercase border bg-fuchsia-950/60 text-fuchsia-400 border-fuchsia-900/50 shadow-lg flex items-center gap-0.5" title="Exceptional Like/Click Ratio">
              🐐 GOATED
            </span>
          )}
          {promoted && (
            <span className="text-[10px] font-sans font-black px-2 py-1 rounded-lg uppercase border bg-amber-950/60 text-amber-400 border-amber-900/50 shadow-lg flex items-center gap-0.5" title="Promoted Content">
              <Flame className="w-3 h-3" />
              HOT
            </span>
          )}
          <span className="text-[10px] font-sans font-black tracking-wide px-2.5 py-1 rounded-lg uppercase border bg-emerald-950/60 text-emerald-400 border-emerald-900/50 shadow-lg">
            {isFree ? "FREE" : `R$ ${asset.price}`}
          </span>
        </div>

        <div className="w-full h-44 overflow-hidden relative bg-slate-900">
          <img
            src={asset.image_url}
            alt={asset.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="p-4 space-y-3 relative z-10 flex-grow flex flex-col justify-between bg-[#111625]/90 border-t border-slate-800">
          <div className="space-y-1">
            <h3
              className="text-sm font-bold truncate font-sans"
              style={{ color: theme.titleColor }}
            >
              {asset.title}
            </h3>
            <p
              className="text-xs line-clamp-2 leading-relaxed pr-6 md:pr-8"
              style={{ color: theme.descColor }}
            >
              {asset.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t text-[10px] font-sans font-semibold gap-1 select-none border-slate-800 text-slate-500">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                recordClick(asset.id);
                if (asset.gamepass_link) window.open(asset.gamepass_link, "_blank");
                else if (isFree && asset.file_url) window.open(asset.file_url, "_blank");
              }}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[9px] tracking-wide uppercase transition-all shadow-md flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Get Now</span>
              <Compass className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="flex items-center gap-1 shrink-0" title="Views">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-slate-400 font-bold">
                  {asset.product_analytics?.views ?? 0}
                </span>
              </span>
              <button
                type="button"
                onClick={(e) => handleLike(e, id)}
                className="flex items-center gap-1 shrink-0 cursor-pointer"
                title={userId ? "Like" : "Sign in to like"}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 transition-colors duration-150 ${
                    hasLiked
                      ? "text-pink-500 fill-pink-500"
                      : "text-slate-400 hover:text-pink-400"
                  }`}
                />
                <span className={hasLiked ? "text-pink-500 font-bold" : "text-slate-400"}>
                  {asset.product_analytics?.likes ?? 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3.5 pt-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
          Don&apos;t waste <span className="text-blue-400">your time...</span>
        </h1>
        <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
          Sell and buy Roblox assets the simple way. Browse live listings below.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative shadow-[0_4px_25px_rgba(0,0,0,0.4)] rounded-2xl">
          <input
            type="text"
            placeholder="Search titles, creator @usernames, maps, UI packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13192b] border border-slate-800 hover:border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          />
          <Search className="absolute left-4 top-4 text-slate-500 w-5 h-5 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {["All", "Model", "Map", "UI Pack"].map((cat) => {
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 border border-blue-500 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "bg-[#13192b] text-slate-400 hover:bg-slate-800/80 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 bg-[#13192b] border border-slate-800 p-1 rounded-xl">
            {[
              { id: "newest", name: "Newest" },
              { id: "top", name: "Best" },
              { id: "free", name: "Free" },
              { id: "paid", name: "Paid" },
            ].map((sort) => {
              const isOptionActive = sortBy === sort.id;
              const arrowIndicator =
                isOptionActive && sort.id !== "free"
                  ? sortDirection === "desc"
                    ? " ↓"
                    : " ↑"
                  : "";
              return (
                <button
                  key={sort.id}
                  type="button"
                  onClick={() => handleSortClick(sort.id as "newest" | "top" | "free" | "paid")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all duration-200 ${
                    isOptionActive
                      ? "bg-blue-600 text-white font-extrabold shadow-sm"
                      : "text-slate-400 hover:text-white bg-transparent"
                  }`}
                >
                  {sort.name}
                  {arrowIndicator}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!hasAny ? (
        <div className="text-center p-12 bg-[#13192b] border border-dashed border-slate-800 rounded-2xl max-w-sm mx-auto space-y-2 shadow-sm">
          <p className="text-sm font-bold text-white">No assets found</p>
          <p className="text-xs text-slate-400">
            {localProducts.length === 0
              ? "No approved listings yet. Check back soon or publish your own asset."
              : "Try modifying your query or category filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div className={GRID_CLASS}>{finalFeed.map(renderCard)}</div>
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          userId={userId}
          hasLiked={likedIds.has(String(selectedProduct.id))}
          onLikeToggle={(id, action) => applyLikeState(String(id), action)}
          onRequireAuth={() => {
            if (!userId) {
              setAuthOpen(true);
            } else {
              setShowRobloxVerify(true);
            }
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {showRobloxVerify && <RobloxVerifyModal onClose={() => setShowRobloxVerify(false)} />}
    </motion.div>
  );
}
