const clickTimers = new Map<string, ReturnType<typeof setTimeout>>();

const getViewCache = () => {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const cached = localStorage.getItem("product_views");
    return cached ? new Set<string>(JSON.parse(cached)) : new Set<string>();
  } catch (e) {
    return new Set<string>();
  }
};

const saveViewCache = (views: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("product_views", JSON.stringify(Array.from(views)));
  } catch (e) {}
};

export function trackProductView(
  id: string | number,
  onRecorded?: () => void
): boolean {
  const key = String(id);
  const views = getViewCache();
  if (views.has(key)) return false;
  
  views.add(key);
  saveViewCache(views);
  
  fetch(`/api/products/${id}/view`, { method: "POST" })
    .then(() => onRecorded?.())
    .catch(() => {});
  return true;
}

/** UI can fire often; DB write once after 2s idle since last click on same product */
export function trackProductClickDebounced(
  id: string | number,
  onRecorded?: () => void
) {
  const key = String(id);
  const existing = clickTimers.get(key);
  if (existing) clearTimeout(existing);

  clickTimers.set(
    key,
    setTimeout(() => {
      clickTimers.delete(key);
      fetch(`/api/products/${id}/click`, { method: "POST" })
        .then(() => onRecorded?.())
        .catch(() => {});
    }, 2000)
  );
}
