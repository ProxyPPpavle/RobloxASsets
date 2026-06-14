export type ProductCustomization = {
  title_color?: string | null;
  description_color?: string | null;
  title_font?: string | null;
  description_font?: string | null;
  bg_color_or_image?: string | null;
  bg_image_storage_url?: string | null;
  border_style?: string | null;
  border_color?: string | null;
  border_width?: number | string | null;
};

export type ProductCardStyles = Record<string, string | number | boolean | null | undefined>;

export type ProductWithTheme = {
  product_customization?: ProductCustomization | ProductCustomization[] | null;
  styles?: ProductCardStyles | null;
};

export function getProductCustomization(product: ProductWithTheme) {
  const customization = product.product_customization;
  return Array.isArray(customization) ? customization[0] ?? null : customization ?? null;
}

export function getFontClass(font?: string | null) {
  switch (font) {
    case "font-display":
    case "font-mono":
    case "font-sans":
      return font;
    default:
      return "font-sans";
  }
}

export function getProductCardTheme(product: ProductWithTheme) {
  const c = getProductCustomization(product);
  const s = product.styles ?? {};
  const borderColor = c?.border_color || (s.borderColor as string) || "#3b82f6";
  const rawBorderWidth = c?.border_width ?? s.borderWidth ?? 1.5;
  const borderWidth =
    typeof rawBorderWidth === "number" ? rawBorderWidth : Number.parseFloat(String(rawBorderWidth));

  return {
    bg:
      c?.bg_image_storage_url ||
      c?.bg_color_or_image ||
      (s.bgImage as string) ||
      (s.bgColor as string) ||
      "#13192b",
    titleColor: c?.title_color || (s.titleColor as string) || (s.textColor as string) || "#FFFFFF",
    descColor: c?.description_color || (s.descriptionColor as string) || "#94A3B8",
    titleFont: getFontClass(c?.title_font || (s.titleFont as string) || (s.fontFamily as string)),
    descFont: getFontClass(c?.description_font || (s.descriptionFont as string)),
    borderColor,
    borderWidth: Number.isFinite(borderWidth) ? borderWidth : 1.5,
  };
}

export function themedBackgroundStyle(bg: string) {
  const isImage = bg.startsWith("http") || bg.startsWith("data:");

  return {
    backgroundColor: isImage ? "#13192b" : bg,
    backgroundImage: isImage ? `url(${bg})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
