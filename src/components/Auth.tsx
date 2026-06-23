"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [showRobloxVerify, setShowRobloxVerify] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("roblox_shop_email");
    if (cached) setEmail(cached);
  }, []);

  const supabase = createClient();

  const trimInput = (val: string) => val.trim();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const emailToUse = trimInput(email);
    localStorage.setItem("roblox_shop_email", emailToUse);

    const { error } = await supabase.auth.signInWithOtp({
      email: emailToUse,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Code sent to your email!");
      setStep("verify");
    }
    
    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let { data, error } = await supabase.auth.verifyOtp({
      email: trimInput(email),
      token: trimInput(token),
      type: "email",
    });

    // 3. Ako to omane (a token nije potpuno mrtav), ovo je mozda Signup kod za novog korisnika!
    if (error) {
      const fallbackResult = await supabase.auth.verifyOtp({
        email,
        token,
        type: "signup",
      });
      if (!fallbackResult.error) {
        error = null; // Rešeno!
      }
    }

    if (error) {
      setMessage("Pogrešan ili istekao kod: " + error.message);
      setLoading(false);
    } else {
      setMessage("Successfully logged in! Refreshing...");
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#161b22] border border-[#30363d] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      
      <div className="flex justify-center mb-6">
        <img 
          src="/LogoAssetsPP.png" 
          alt="AssetsPP Logo" 
          className="w-16 h-16 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" 
        />
      </div>
      <h2 className="text-2xl font-extrabold text-white mb-2 text-center">
        {step === "request" ? "Welcome to AssetsPP" : "Verify Your Email"}
      </h2>
      <p className="text-[#8b949e] text-center mb-6 text-sm">
        {step === "request" 
          ? "Enter your email to log in or sign up." 
          : "Check your email for the verification code."}
      </p>

      {message && (
        <div className={`p-3 rounded-lg mb-6 text-sm font-bold border text-center ${message.includes("sent") || message.includes("Successfully") ? "bg-[#2ea043]/20 text-[#3fb950] border-[#2ea043]/30" : "bg-[#da3633]/20 text-[#ff7b72] border-[#da3633]/30"}`}>
          {message}
        </div>
      )}

      {step === "request" ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8b949e] font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full p-3 bg-[#0d1117] text-white border border-[#30363d] rounded-lg focus:outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>
            <button
              type="submit"
              disabled={loading}
              className="ml-auto w-auto bg-[#58a6ff] hover:bg-[#3182ce] text-white font-bold py-2 px-4 rounded transition"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8b949e] font-bold mb-1">Enter Code</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="12345678"
              required
              className="w-full p-3 bg-[#0d1117] text-white border border-[#30363d] rounded-lg focus:outline-none focus:border-[#58a6ff] text-center tracking-widest text-xl font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2ea043] hover:bg-[#3fb950] text-white font-bold p-3 rounded-lg transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("request");
              setMessage("");
            }}
            className="w-full p-3 text-sm font-bold text-[#8b949e] hover:text-white transition-colors"
          >
            ← Use a different email
          </button>
        </form>
      )}

    </div>
  );
}
