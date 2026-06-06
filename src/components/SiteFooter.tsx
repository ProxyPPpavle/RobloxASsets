import { Globe, MessageCircle, Video, Code2 } from "lucide-react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="w-full mt-16 pt-12 pb-28 border-t border-slate-800 relative z-20 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-display font-black text-white shadow-md">
                A
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Assets<span className="text-blue-500 font-extrabold">PP</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Don&apos;t waste your time looking elsewhere. Discover, buy, and sell Roblox
              models, maps, UI packs, and custom templates.
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              {[
                { href: "#discord", Icon: Globe, title: "Discord" },
                { href: "#twitter", Icon: MessageCircle, title: "Social" },
                { href: "#youtube", Icon: Video, title: "YouTube" },
                { href: "#github", Icon: Code2, title: "GitHub" },
              ].map(({ href, Icon, title }) => (
                <a
                  key={title}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-[#13192b] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
                  title={title}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Legal & Info
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#dmca" className="hover:text-blue-400 transition-colors">DMCA Compliance</a></li>
              <li><a href="#cookies" className="hover:text-blue-400 transition-colors">Cookie Settings</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#faq" className="hover:text-blue-400 transition-colors">FAQ & Help</a></li>
              <li><a href="#support" className="hover:text-blue-400 transition-colors">Developer Support</a></li>
              <li><a href="#roblox" className="hover:text-blue-400 transition-colors">Roblox Guidelines</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AssetsPP Portal. Not affiliated with Roblox
            Corporation.
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Developer Cloud Hub Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
