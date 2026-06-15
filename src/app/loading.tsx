import AppShell from "@/components/AppShell";

const skeletonCards = Array.from({ length: 8 }, (_, index) => index);

export default function Loading() {
  return (
    <AppShell user={null} isLoggedIn={false}>
      <div className="space-y-8 animate-pulse" aria-label="Loading AssetsPP marketplace">
        <div className="text-center space-y-3.5 pt-4 max-w-2xl mx-auto">
          <div className="h-11 sm:h-12 md:h-14 w-full max-w-xl mx-auto rounded-xl bg-slate-800/70" />
          <div className="h-4 w-full max-w-md mx-auto rounded-lg bg-slate-800/60" />
          <div className="h-4 w-56 mx-auto rounded-lg bg-slate-800/50" />
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-14 rounded-2xl border border-slate-800 bg-[#13192b] shadow-[0_4px_25px_rgba(0,0,0,0.35)]" />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex gap-1.5">
              <div className="h-8 w-14 rounded-xl bg-slate-800/70" />
              <div className="h-8 w-20 rounded-xl bg-slate-800/60" />
              <div className="h-8 w-16 rounded-xl bg-slate-800/60" />
            </div>
            <div className="h-9 w-56 rounded-xl border border-slate-800 bg-[#13192b]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {skeletonCards.map((card) => (
            <div
              key={card}
              className="min-h-[280px] overflow-hidden rounded-2xl border border-slate-800 bg-[#111625]/90"
            >
              <div className="h-44 bg-slate-900/95" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-slate-800/80" />
                <div className="h-3 w-full rounded bg-slate-800/60" />
                <div className="h-3 w-2/3 rounded bg-slate-800/50" />
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <div className="h-8 w-20 rounded-xl bg-blue-700/50" />
                  <div className="h-4 w-24 rounded bg-slate-800/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
