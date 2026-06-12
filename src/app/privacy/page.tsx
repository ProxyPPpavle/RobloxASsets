import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#090C15] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: June 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Data Collection</h2>
            <p>We only collect the absolute minimum data required for the platform to function securely. The only private (and public) information we require for registration and verification are:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your Email Address (for authentication).</li>
              <li>Your Public Roblox Client ID and Username (for verifying purchases).</li>
            </ul>
            <p className="mt-2">We do not use passwords. We use secure OTP (One-Time Passwords) via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. How We Use Your Data</h2>
            <p>Your data is used exclusively on this platform to manage your account, verify your Roblox identity, and process transactions. We do not sell, share, or use your data anywhere else.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Platform Access</h2>
            <p>Users can freely browse and access the platform without logging in. Logging in is only necessary if you intend to perform transactions or upload assets.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Data Deletion</h2>
            <p>You have full control over your data. You can completely delete your account and all associated data at any time by clicking the trash can icon at the top of your profile page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Contact</h2>
            <p>If you have any questions regarding your privacy, please contact us at: <a href="mailto:ppextensionstore@gmail.com" className="text-blue-400 hover:underline">ppextensionstore@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
