import { Globe, MessageCircle, Video, Code2 } from "lucide-react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="w-full mt-16 pt-12 pb-28 border-t border-slate-800 relative z-20 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/LogoAssetsPP.png" 
                alt="AssetsPP Logo" 
                className="w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
              />
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
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/dmca" className="hover:text-blue-400 transition-colors">DMCA Compliance</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-400 transition-colors">Cookie Settings</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="mailto:assetsppteam@gmail.com" className="hover:text-blue-400 transition-colors">Developer Support</a></li>
              <li><a href="mailto:assetsppteam@gmail.com" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
