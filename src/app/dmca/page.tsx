import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-[#090C15] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-white">DMCA Compliance</h1>
        <p className="text-sm text-gray-400">Last updated: June 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Notice of Infringement</h2>
            <p>If you believe that your intellectual property rights have been violated by any content on our platform, please send a detailed DMCA takedown notice to our support team.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. How to Report</h2>
            <p>Please include the following information in your notice:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>A description of the copyrighted work that you claim has been infringed.</li>
              <li>The exact URL where the allegedly infringing material is located.</li>
              <li>Your contact information (name, address, telephone number, and email).</li>
              <li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Contact</h2>
            <p>Submit your DMCA notice to: <a href="mailto:assetsppteam@gmail.com" className="text-blue-400 hover:underline">assetsppteam@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
