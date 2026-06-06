"use client";

import { useEffect, useState } from "react";
import { parseGamepassId } from "@/lib/roblox";

export default function AdminPriceBadge({
  gamepassLink,
  isFree,
}: {
  gamepassLink?: string | null;
  isFree?: boolean;
}) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(!isFree && !!gamepassLink);

  useEffect(() => {
    if (isFree || !gamepassLink) {
      setLoading(false);
      return;
    }
    const id = parseGamepassId(gamepassLink);
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(`/api/price/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.uspeh) setPrice(d.price);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gamepassLink, isFree]);

  if (isFree || !gamepassLink) {
    return (
      <span className="text-[10px] font-mono bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-md">
        FREE
      </span>
    );
  }

  if (loading) {
    return (
      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
        Checking Roblox…
      </span>
    );
  }

  if (price === null) {
    return (
      <span className="text-[10px] font-mono bg-rose-900/40 text-rose-400 px-2 py-0.5 rounded-md">
        Price unknown
      </span>
    );
  }

  return (
    <span className="text-[10px] font-mono bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-md">
      R$ {price} (Roblox)
    </span>
  );
}
