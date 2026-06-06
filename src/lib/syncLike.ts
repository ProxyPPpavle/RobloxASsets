const inflight = new Map<string, Promise<"liked" | "unliked" | null>>();

/** Background like sync — UI should update optimistically before calling this */
export function syncProductLike(productId: string | number): Promise<"liked" | "unliked" | null> {
  const key = String(productId);
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = fetch(`/api/products/${key}/boost`, { method: "POST" })
    .then(async (res) => {
      const data = await res.json();
      if (!data.success || !data.action) return null;
      return data.action as "liked" | "unliked";
    })
    .catch(() => null)
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}
