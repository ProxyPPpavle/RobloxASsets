/** Promoted assets first, then engagement score, then recency */
export function sortFeedProducts<T extends FeedSortableProduct>(products: T[]): T[] {
  const now = Date.now();
  const promoted: T[] = [];
  const regular: T[] = [];

  for (const p of products) {
    if (isProductPromoted(p, now)) promoted.push(p);
    else regular.push(p);
  }

  return [...sortPromotedProducts(promoted, now), ...sortRegularByScore(regular, now)];
}

export type FeedSortableProduct = {
  created_at: string;
  product_analytics?: { views?: number; likes?: number } | null;
  product_monetization?: { promoted?: boolean; promoted_until?: string | null } | null;
};

export function isProductPromoted(
  product: {
    product_monetization?: { promoted?: boolean; promoted_until?: string | null } | null;
  },
  now = Date.now()
) {
  const until = product.product_monetization?.promoted_until;
  if (!until) return false;
  return new Date(until).getTime() > now;
}

export function sortPromotedProducts<T extends FeedSortableProduct>(
  products: T[],
  now = Date.now()
): T[] {
  return [...products].sort((a, b) => {
    const aUntil = new Date(a.product_monetization?.promoted_until ?? 0).getTime();
    const bUntil = new Date(b.product_monetization?.promoted_until ?? 0).getTime();
    if (bUntil !== aUntil) return bUntil - aUntil;

    const aScore =
      (a.product_analytics?.views ?? 0) + (a.product_analytics?.likes ?? 0) * 5;
    const bScore =
      (b.product_analytics?.views ?? 0) + (b.product_analytics?.likes ?? 0) * 5;
    if (bScore !== aScore) return bScore - aScore;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function sortRegularByScore<T extends FeedSortableProduct>(products: T[], _now: number): T[] {
  return [...products].sort((a, b) => {
    const aScore =
      (a.product_analytics?.views ?? 0) + (a.product_analytics?.likes ?? 0) * 5;
    const bScore =
      (b.product_analytics?.views ?? 0) + (b.product_analytics?.likes ?? 0) * 5;
    if (bScore !== aScore) return bScore - aScore;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
