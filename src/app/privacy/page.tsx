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
            <p>We only collect the absolute minimum data required for the platform to function securely. Specifically, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Email Address:</strong> If provided, used for authentication via secure One-Time Passwords (OTP).</li>
              <li><strong>Roblox Public Profile Data:</strong> When you log in via Roblox OAuth, we securely receive your public Roblox User ID and Username.</li>
              <li><strong>Platform Activity:</strong> Information regarding assets you upload, purchase, or interact with on the AssetsPP marketplace.</li>
            </ul>
            <p className="mt-2 text-blue-400 font-semibold">We do not use passwords. We use secure OTP via email and official Roblox OAuth 2.0 verification.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. How We Use Your Data</h2>
            <p>Your data is used strictly and exclusively for operating the AssetsPP marketplace:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To manage and secure your account.</li>
              <li>To authenticate your identity via Roblox OAuth.</li>
              <li>To process your asset transactions, uploads, and purchases.</li>
            </ul>
            <p className="mt-2 font-semibold">We NEVER sell, rent, or share your data with third parties or use it anywhere outside this platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Platform Access</h2>
            <p>Users can freely browse and access the platform without logging in. Logging in is only necessary if you intend to perform transactions, upload assets, or interact with features requiring a verified identity.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Data Deletion Request (Right to be Forgotten)</h2>
            <p>You have absolute control over your personal data and the right to request full erasure at any time.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Manual Deletion:</strong> You can completely delete your account and all associated data at any time by clicking the trash can icon at the top of your profile page.</li>
              <li><strong>Email Request:</strong> You may also formally request full data erasure by emailing us directly at <a href="mailto:assetsppteam@gmail.com" className="text-blue-400 hover:underline font-semibold">assetsppteam@gmail.com</a>. We process all manual deletion requests strictly within 48 hours.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Contact</h2>
            <p>If you have any questions regarding your privacy, data safety, or wish to exercise your data rights, please contact us at: <a href="mailto:assetsppteam@gmail.com" className="text-blue-400 hover:underline">assetsppteam@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
