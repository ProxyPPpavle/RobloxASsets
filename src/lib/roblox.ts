/** Extract Roblox gamepass ID from common URL formats */
export function parseGamepassId(link: string): string | null {
  const decoded = decodeURIComponent(link.trim());

  const patterns = [
    /(?:game[- ]?pass|gamepass)[\/=](\d+)/i,
    /\/passes\/(\d+)/i,
    /[?&]gamepass(?:Id)?=(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

type RobloxProductInfo = {
  PriceInRobux?: number;
  price?: number;
  priceInformation?: {
    defaultPriceInRobux?: number;
    lowestPriceInRobux?: number;
  };
};

/** Read price from Roblox product-info JSON (new + legacy shapes) */
export function extractPriceFromProductInfo(data: RobloxProductInfo): number | null {
  const info = data.priceInformation;
  if (typeof info?.defaultPriceInRobux === "number" && info.defaultPriceInRobux >= 0) {
    return info.defaultPriceInRobux;
  }
  if (typeof info?.lowestPriceInRobux === "number" && info.lowestPriceInRobux >= 0) {
    return info.lowestPriceInRobux;
  }
  if (typeof data.PriceInRobux === "number" && data.PriceInRobux >= 0) {
    return data.PriceInRobux;
  }
  // Do NOT use top-level `price` — deprecated and often wrong vs defaultPriceInRobux
  return null;
}

/** Fetch gamepass price from Roblox. Returns null if unavailable. */
export async function fetchRobloxPrice(gamepassId: string): Promise<number | null> {
  const headers = {
    Accept: "application/json",
    "User-Agent": "Mozilla/5.0 (compatible; AssetsPP/1.0)",
  };

  try {
    const res = await fetch(
      `https://apis.roblox.com/game-passes/v1/game-passes/${gamepassId}/product-info`,
      { headers, cache: "no-store" }
    );

    if (res.ok) {
      const data = (await res.json()) as RobloxProductInfo;
      const price = extractPriceFromProductInfo(data);
      if (price !== null) return price;
    }

    // Legacy fallback (deprecated but still works for some passes)
    const legacy = await fetch(
      `https://economy.roblox.com/v1/game-passes/${gamepassId}/game-pass-product-info`,
      { headers, cache: "no-store" }
    );
    if (legacy.ok) {
      const data = (await legacy.json()) as RobloxProductInfo;
      const price = extractPriceFromProductInfo(data);
      if (price !== null) return price;
    }
  } catch (err) {
    console.error("Roblox price fetch failed:", err);
  }

  return null;
}

export async function fetchRobloxPriceFromLink(link: string): Promise<number | null> {
  const id = parseGamepassId(link);
  if (!id) return null;
  return fetchRobloxPrice(id);
}
