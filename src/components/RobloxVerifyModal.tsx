"use client";

import { useRouter } from "next/navigation";

export default function RobloxVerifyModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleVerify = () => {
    // Redirect to Roblox OAuth flow, after verification we come back to current page
    // We use ?next=encodedCurrentPath so that after OAuth we can return here.
    const current = typeof window !== "undefined" ? window.location.pathname : "/";
    const redirectUrl = `/api/roblox/auth?next=${encodeURIComponent(current)}`;
    router.push(redirectUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#090c15] border border-[#30363d] rounded-xl p-6 max-w-md w-full text-center shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Verify Roblox Account</h2>
        <p className="text-[#c9d1d9] mb-6">
          To buy assets for Robux you need to verify your Roblox account.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleVerify}
            className="bg-[#58a6ff] hover:bg-[#3182ce] text-white font-semibold py-2 px-4 rounded transition"
          >
            Verify with Roblox
          </button>
          <button
            onClick={onClose}
            className="bg-[#da3633] hover:bg-[#b91c1c] text-white font-semibold py-2 px-4 rounded transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
