import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#090C15] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-sm text-gray-400">Last updated: June 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Acceptable Use</h2>
            <p>As a user of the AssetsPP platform, you agree not to actively violate our community guidelines or attempt to harm the platform. The following are strictly prohibited:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>No sexual or explicit content.</li>
              <li>No hate speech directed at any nation, religion, race, or group.</li>
              <li>No uploading or distributing suspicious files, malware, or viruses.</li>
              <li>No scamming, fraud, or deceptive practices targeting other users.</li>
            </ul>
            <p className="mt-4 font-bold text-blue-400">Please note: Our admin team manually reviews all published assets to ensure compliance before they appear on the public feed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Violations and Bans</h2>
            <p>We reserve the right to review user activity and content. Any violation of these terms may result in immediate suspension or a permanent ban from the platform. Flagged accounts will lose access to uploading and purchasing capabilities.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Contact</h2>
            <p>If you have any questions or concerns regarding these terms, please contact us at: <a href="mailto:assetsppteam@gmail.com" className="text-blue-400 hover:underline">assetsppteam@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
