"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FastCreateProfileButton() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const randomEmail = `guest${Date.now()}@example.com`;
      const password = "guestpass";
      // Try sign up (creates and logs in)
      let { error } = await supabase.auth.signUp({ email: randomEmail, password });
      if (error && error.message?.includes("User already exists")) {
        // If user exists, sign in instead
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: randomEmail, password });
        error = signInError;
      }
      if (error) {
        alert("Error creating profile: " + error.message);
      } else {
        // Session established, reload to fetch it
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      alert("Unexpected error while creating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="mt-6 w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold p-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 neon-glow-green"
    >
      {loading ? "Creating..." : "Create Profile Fast"}
    </button>
  );
}
