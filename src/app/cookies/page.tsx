import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#090C15] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Cookie Settings</h1>
        <p className="text-sm text-gray-400">Last updated: June 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Essential Cookies</h2>
            <p>We only use essential cookies that are required for the platform to function properly, such as maintaining your login session. We do not use third-party tracking cookies or advertising cookies.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
