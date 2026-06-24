"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import AdminActionButtons from "@/components/AdminActionButtons";
import AdminPriceBadge from "@/components/AdminPriceBadge";
import { ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { verifyAdminRole } from "./actions";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "pp";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (sessionStorage.getItem("admin_auth") === "true") {
        if (session?.user) {
          const isAdmin = await verifyAdminRole();
          if (isAdmin) {
            setIsAuthenticated(true);
            return;
          }
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPending();
    }
  }, [isAuthenticated]);

  const fetchPending = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*, profiles(username, avatar_url)")
      .eq("approved", "pending")
      .order("created_at", { ascending: true });

    setPendingProducts(data || []);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to your account first to access Admin.");
      return;
    }
    
    if (password === ADMIN_PASSWORD) {
      const isAdmin = await verifyAdminRole();
        
      if (isAdmin) {
        sessionStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        alert("Access Denied: You are not an admin in the database.");
      }
    } else {
      alert("Wrong password.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-[#161b22] p-8 rounded-2xl border border-[#30363d] w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Admin Access</h2>
          <p className="text-xs text-gray-500 text-center mb-6">
            Log in with an admin account, or use the team password.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full p-3 bg-[#0d1117] text-white border border-[#30363d] rounded-lg mb-4 focus:outline-none focus:border-[#58a6ff]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#58a6ff] hover:bg-[#1f6feb] text-white rounded-lg font-bold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col z-10 transition-all duration-300 pb-32">
      <Navbar user={user} />

      <motion.div
        key="admin-page"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 pt-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-semibold tracking-tight text-white flex items-center gap-2">
            Admin Dashboard <ShieldCheck className="w-6 h-6 text-blue-500" />
          </h1>
          <p className="text-xs text-gray-400">
            Approve posts to publish them, or reject to delete files and notify the creator.
          </p>
        </div>

        {loading ? (
          <div className="text-center p-10 text-gray-500 font-mono">Loading queue...</div>
        ) : pendingProducts.length === 0 ? (
          <div className="p-10 text-center bg-[#0F131E] border border-white/5 rounded-2xl max-w-xl mx-auto space-y-4 flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-white">All caught up!</span>
            <p className="text-xs text-gray-500 max-w-sm">
              No pending submissions. Approved items appear on the home feed.
            </p>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>Pending ({pendingProducts.length})</span>
            </div>

            <AnimatePresence mode="popLayout">
              {pendingProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#0b0c16] border border-blue-900/35 p-5 rounded-2xl space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-white/5 text-gray-300 border border-white/5 px-2 py-0.5 rounded-md">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                      {product.category && (
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {product.category}
                        </span>
                      )}
                      <AdminPriceBadge
                        gamepassLink={product.gamepass_link}
                        isFree={!product.gamepass_link}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      @{product.profiles?.username || "user"}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-bold text-white font-sans">{product.title}</h3>
                      <p className="text-xs text-gray-400 font-sans line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="pt-2 flex gap-2 flex-wrap">
                        {product.gamepass_link && (
                          <a
                            href={product.gamepass_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-blue-400 hover:text-white font-mono"
                          >
                            [Gamepass]
                          </a>
                        )}
                        {product.file_url && (
                          <a
                            href={product.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-400 hover:text-white font-mono"
                          >
                            [.rbxm]
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-3">
                    <AdminActionButtons
                      productId={product.id}
                      onSuccess={(id) =>
                        setPendingProducts((prev) => prev.filter((p) => p.id !== id))
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
