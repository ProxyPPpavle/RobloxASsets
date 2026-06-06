"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Compass,
  Coins,
  Flame,
  Mail,
  Inbox,
  CheckCircle,
  AlertCircle,
  DownloadCloud,
  LogOut,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import EditProfileButton from "./EditProfileButton";
import DeleteProductButton from "./DeleteProductButton";
import DeleteNotificationButton from "./DeleteNotificationButton";
import PromoteModal from "./PromoteModal";
import { isProductPromoted } from "@/lib/feedSort";

type ProductRow = {
  id: number;
  title: string;
  image_url: string;
  price?: number;
  approved: string;
  product_analytics?: { views?: number; clicks?: number };
  product_monetization?: { promoted?: boolean; promoted_until?: string };
};

type NotifRow = {
  notification_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  attachment_url?: string | null;
};

export default function ProfileClient({
  profile,
  email,
  memberSince,
  initialProducts,
  initialNotifications,
}: {
  profile: { username?: string; avatar_url?: string };
  email: string;
  memberSince: string;
  initialProducts: ProductRow[];
  initialNotifications: NotifRow[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [promoteTarget, setPromoteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const supabase = createClient();

  const displayName = profile.username || email.split("@")[0];

  const totalViews = products.reduce((a, p) => a + (p.product_analytics?.views ?? 0), 0);
  const totalClicks = products.reduce((a, p) => a + (p.product_analytics?.clicks ?? 0), 0);
  const totalEarned = 0; // We can integrate a sales table later
  const unreadCount = notifications.filter((m) => !m.is_read).length;

  const handleDownload = (msg: NotifRow) => {
    if (!msg.attachment_url) return;
    window.open(msg.attachment_url, "_blank");
    setDownloadedIds((prev) => new Set(prev).add(msg.notification_id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="pt-10 md:pt-12 font-sans">
      <div className="flex flex-col gap-6 xl:gap-8 items-start">
        {/* Main Header and Metrics */}
        <div className="w-full space-y-6">
          <div className="bg-[#151b2d] border border-slate-700/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 bg-slate-900 shrink-0">
                <img
                  src={
                    profile.avatar_url ||
                    `https://ui-avatars.com/api/?name=${email.charAt(0)}`
                  }
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">{displayName}</h2>
                <p className="text-sm text-slate-400">@{displayName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{email}</p>
                <span className="text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-0.5 rounded-full mt-1.5 inline-block border border-slate-800">
                  Member since {memberSince}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <EditProfileButton currentUsername={displayName} />
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-sans font-semibold text-slate-400 hover:text-white py-2 px-3 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Views", value: totalViews, color: "text-blue-400", Icon: Eye },
              { label: "Total Clicks", value: totalClicks, color: "text-emerald-400", Icon: Compass },
              { label: "Est. Earnings", value: `R$ ${Math.round(totalEarned)}`, color: "text-amber-500", Icon: Coins },
            ].map(({ label, value, color, Icon }) => (
              <div
                key={label}
                className="bg-[#151b2d] border border-slate-700 rounded-2xl p-4 h-24 flex flex-col justify-end relative"
              >
                <Icon className={`w-4 h-4 absolute top-3 right-3 ${color}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {label}
                </span>
                <p className={`text-2xl font-black leading-none mt-0.5 ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom columns: Left My Assets, Right Inbox */}
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start w-full">
          {/* Left: My Assets */}
          <div className="w-full xl:w-1/3 2xl:w-[400px] shrink-0 space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
              My Assets ({products.length})
            </h3>

            {products.length === 0 ? (
              <div className="p-10 text-center bg-[#13192b] border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm text-gray-400">No published assets yet. Tap + to upload.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((asset) => {
                  const isPromoted = isProductPromoted(asset);

                  return (
                    <motion.div
                      key={asset.id}
                      layout
                      initial={false}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#111625] border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-600 transition-all"
                    >
                      <div className="w-full aspect-[4/3] bg-black/40 relative overflow-hidden">
                        <img
                          src={asset.image_url}
                          alt={asset.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-black/70 text-emerald-400 border border-white/10">
                          {(asset.price ?? 0) === 0 ? "FREE" : `R$ ${asset.price}`}
                        </span>
                        <span
                          className={`absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm border ${
                            asset.approved === "approved"
                              ? "bg-emerald-950/70 text-emerald-400 border-emerald-800/50"
                              : "bg-amber-950/70 text-amber-400 border-amber-800/50"
                          }`}
                        >
                          {asset.approved === "approved" ? "LIVE" : "PENDING"}
                        </span>
                      </div>

                      <div className="p-2.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-bold text-white truncate">
                              {asset.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-0.5 text-blue-400">
                                <Eye className="w-3 h-3" />
                                {asset.product_analytics?.views ?? 0}
                              </span>
                              <span className="flex items-center gap-0.5 text-emerald-400">
                                <Compass className="w-3 h-3" />
                                {asset.product_analytics?.clicks ?? 0}
                              </span>
                              {isPromoted && <Flame className="w-3 h-3 text-amber-400" />}
                            </p>
                          </div>
                          <DeleteProductButton
                            productId={asset.id}
                            onDeleted={(id) =>
                              setProducts((prev) => prev.filter((p) => p.id !== id))
                            }
                          />
                        </div>
                        {asset.approved === "approved" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPromoteTarget({ id: asset.id, title: asset.title })
                            }
                            className="w-full text-[10px] font-bold py-1.5 rounded-lg border border-amber-900/50 bg-amber-950/30 text-amber-400 hover:bg-amber-950/50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Flame className="w-3 h-3" />
                            {isPromoted ? "Extend promotion" : "Promote"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Inbox */}
          <div className="flex-1 min-w-0 space-y-3 w-full xl:max-h-[calc(100vh-5rem)] xl:overflow-y-auto">
            <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Inbox className="w-4 h-4 text-slate-500" />
              Inbox ({unreadCount})
            </h3>
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <div className="p-8 text-center bg-[#13192b] border border-slate-800 rounded-2xl">
                <Mail className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-300">Your inbox is empty.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((msg) => {
                  const isApproval = msg.title?.toLowerCase().includes("approved");
                  const isRejection =
                    msg.title?.toLowerCase().includes("rejected") ||
                    msg.title?.toLowerCase().includes("blocked");
                  const hasFile = !!msg.attachment_url;
                  const wasDownloaded = downloadedIds.has(msg.notification_id);

                  return (
                    <motion.div
                      key={msg.notification_id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className={`relative p-3.5 rounded-xl border transition-colors ${
                        !msg.is_read
                          ? "bg-[#151a2e] border-blue-900/60"
                          : "bg-[#13192b] border-slate-800"
                      }`}
                    >
                      <div className="absolute top-2.5 right-2.5">
                        <DeleteNotificationButton
                          notifId={msg.notification_id}
                          onDeleted={(id) =>
                            setNotifications((prev) =>
                              prev.filter((n) => n.notification_id !== id)
                            )
                          }
                        />
                      </div>

                      <div className="pr-8 space-y-2">
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${
                              isApproval
                                ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-400"
                                : isRejection
                                ? "bg-rose-950/40 border-rose-800/50 text-rose-400"
                                : "bg-white/5 border-white/10 text-gray-400"
                            }`}
                          >
                            {isApproval ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : isRejection ? (
                              <AlertCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Mail className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between gap-1">
                              <h4 className="text-xs font-semibold text-white truncate">
                                {msg.title}
                              </h4>
                              <span className="text-[9px] text-gray-500 shrink-0">
                                {new Date(msg.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-3">
                              {msg.message}
                            </p>
                          </div>
                        </div>

                        {hasFile && (
                          <button
                            type="button"
                            onClick={() => handleDownload(msg)}
                            className="w-full text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <DownloadCloud className="w-3.5 h-3.5" />
                            {wasDownloaded ? "Download again" : "Download file"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>

      {promoteTarget && (
        <PromoteModal
          productId={promoteTarget.id}
          productTitle={promoteTarget.title}
          onClose={() => setPromoteTarget(null)}
          onPromoted={(promotedUntil) => {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === promoteTarget.id
                  ? {
                      ...p,
                      product_monetization: {
                        promoted: true,
                        promoted_until: promotedUntil,
                      },
                    }
                  : p
              )
            );
          }}
        />
      )}
    </div>
  );
}
