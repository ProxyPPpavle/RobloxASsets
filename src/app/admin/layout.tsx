"use client";

import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen premium-grid-bg bg-[#06080F] text-white">
      {/* You can add a Navbar here if needed */}
      <main className="max-w-7xl mx-auto p-6 pt-20">{children}</main>
    </div>
  );
}
