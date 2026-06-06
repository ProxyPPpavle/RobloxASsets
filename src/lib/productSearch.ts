export type SearchableProduct = {
  title?: string;
  description?: string | null;
  category?: string;
  profiles?: { username?: string } | null;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function tokenize(query: string) {
  return normalize(query).split(/\s+/).filter((t) => t.length > 0);
}

/** Subsequence + prefix bonus (lightweight fuzzy) */
function tokenFieldScore(token: string, field: string): number {
  if (!field) return 0;
  if (field === token) return 3;
  if (field.startsWith(token)) return 2.2;
  if (field.includes(token)) return 1.6;

  let ti = 0;
  for (const ch of field) {
    if (ch === token[ti]) ti++;
    if (ti === token.length) return 0.55 + (token.length / field.length) * 0.4;
  }
  return 0;
}

function scoreProduct(item: SearchableProduct, tokens: string[]): number {
  const title = normalize(item.title ?? "");
  const desc = normalize(item.description ?? "");
  const category = normalize(item.category ?? "");
  const user = normalize(item.profiles?.username ?? "");

  let total = 0;
  for (const token of tokens) {
    const best = Math.max(
      tokenFieldScore(token, title) * 1.4,
      tokenFieldScore(token, user) * 1.15,
      tokenFieldScore(token, category) * 1.05,
      tokenFieldScore(token, desc) * 0.85
    );
    if (best <= 0) return 0;
    total += best;
  }
  return total / tokens.length;
}

/** Client-side search engine: token + fuzzy scoring, relevance sort */
export function searchProducts<T extends SearchableProduct>(
  items: T[],
  query: string
): T[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return items;

  const ranked = items
    .map((item) => ({ item, score: scoreProduct(item, tokens) }))
    .filter((r) => r.score >= 0.45)
    .sort((a, b) => b.score - a.score);

  return ranked.map((r) => r.item);
}
