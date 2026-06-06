import { isProductPromoted, sortPromotedProducts } from "./feedSort";

export type FeedSortMode = "newest" | "top" | "free" | "paid";

export type FeedSortable = {
  created_at: string;
  price?: number;
  product_analytics?: { views?: number; likes?: number } | null;
  product_monetization?: {
    promoted?: boolean;
    promoted_until?: string | null;
  } | null;
};

export function sortRegularProducts<T extends FeedSortable>(
  items: T[],
  sortBy: FeedSortMode,
  sortDirection: "asc" | "desc"
): T[] {
  return [...items].sort((a, b) => {
    if (sortBy === "newest") {
      return sortDirection === "desc"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === "top") {
      const aScore =
        (a.product_analytics?.views ?? 0) + (a.product_analytics?.likes ?? 0) * 5;
      const bScore =
        (b.product_analytics?.views ?? 0) + (b.product_analytics?.likes ?? 0) * 5;
      return sortDirection === "desc" ? bScore - aScore : aScore - bScore;
    }
    if (sortBy === "free") {
      const aFree = (a.price ?? 0) === 0;
      const bFree = (b.price ?? 0) === 0;
      return aFree === bFree ? 0 : aFree ? -1 : 1;
    }
    if (sortBy === "paid") {
      const aFree = (a.price ?? 0) === 0;
      const bFree = (b.price ?? 0) === 0;
      if (aFree && !bFree) return 1;
      if (!aFree && bFree) return -1;
      return sortDirection === "asc"
        ? (a.price ?? 0) - (b.price ?? 0)
        : (b.price ?? 0) - (a.price ?? 0);
    }
    return 0;
  });
}

/** Row 1 block = promoted; following block = regular (user sort) */
export function partitionFeedProducts<T extends FeedSortable>(
  items: T[],
  sortBy: FeedSortMode,
  sortDirection: "asc" | "desc"
): { promoted: T[]; regular: T[] } {
  const promoted: T[] = [];
  const regular: T[] = [];

  for (const item of items) {
    if (isProductPromoted(item)) promoted.push(item);
    else regular.push(item);
  }

  return {
    promoted: sortPromotedProducts(promoted),
    regular: sortRegularProducts(regular, sortBy, sortDirection),
  };
}
