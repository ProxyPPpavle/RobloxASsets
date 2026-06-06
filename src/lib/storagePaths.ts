/** Extract object path(s) inside shop-assets bucket from a public or signed URL */
export function storagePathFromUrl(url?: string | null): string | null {
  if (!url) return null;

  try {
    const decoded = decodeURIComponent(url);
    const publicMatch = decoded.match(/\/object\/public\/shop-assets\/(.+?)(?:\?|#|$)/i);
    if (publicMatch) return publicMatch[1];

    const shortMatch = decoded.match(/shop-assets\/(.+?)(?:\?|#|$)/i);
    if (shortMatch) return shortMatch[1];
  } catch {
    const publicMatch = url.match(/\/object\/public\/shop-assets\/(.+?)(?:\?|#|$)/i);
    if (publicMatch) return publicMatch[1];
    const shortMatch = url.match(/shop-assets\/(.+?)(?:\?|#|$)/i);
    if (shortMatch) return shortMatch[1];
  }

  return null;
}

export function storagePathsFromProductUrls(
  imageUrl?: string | null,
  fileUrl?: string | null,
  extraUrls: (string | null | undefined)[] = []
) {
  const paths = new Set<string>();
  for (const url of [imageUrl, fileUrl, ...extraUrls]) {
    const p = storagePathFromUrl(url);
    if (p) paths.add(p);
  }
  return Array.from(paths);
}
