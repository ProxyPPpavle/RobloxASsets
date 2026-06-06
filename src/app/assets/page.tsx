import React from "react";

export default function AssetsPage() {
  return (
    <main className="min-h-screen bg-[#06080F] flex items-center justify-center p-8">
      <iframe
        src="/RobloxASsets-main/index.html"
        title="Roblox Assets"
        className="w-full h-[80vh] border border-[#30363d] rounded-lg shadow-xl bg-[#0F131E]"
      />
    </main>
  );
}
