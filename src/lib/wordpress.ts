import { fetchGraphQL } from "./graphql";
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from "./queries/products";

/* ── Types ────────────────────────────────────────────────── */

export interface WCProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: { sourceUrl: string } | null;
  galleryImages: { nodes: { sourceUrl: string }[] };
  productCategories: { nodes: { name: string; slug: string }[] };
  // Present only on SimpleProduct via inline fragment
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
}

interface ProductsData {
  products: { nodes: WCProduct[] };
}

interface ProductData {
  product: WCProduct | null;
}

/* ── Helpers ──────────────────────────────────────────────── */

/** Strip HTML tags from WooCommerce description strings. */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract a clean numeric price string from WooCommerce price output.
 * WC can return: "1,399.00 DH", "<span>1,399.00</span>", "1 399,00 MAD", etc.
 * Returns the numeric part only (e.g. "1,399") or null if unparseable.
 */
export function formatPrice(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const text = stripHtml(raw);
  // Extract first numeric sequence (digits, commas, dots)
  const match = text.match(/([\d\s,]+(?:\.\d{1,2})?)/);
  if (!match) return text;
  return match[1]
    .replace(/\s/g, "")
    .replace(/\.00$/, "")
    .replace(/,00$/, "")
    .trim();
}

/* ── Product fetchers ─────────────────────────────────────── */

/**
 * Fetch all published WooCommerce products.
 * Returns [] if the endpoint is unreachable or WooGraphQL is inactive.
 */
export async function getProducts(): Promise<WCProduct[]> {
  try {
    const data = await fetchGraphQL<ProductsData>(GET_PRODUCTS, undefined, 3600);
    return data.products?.nodes ?? [];
  } catch (err) {
    console.error("[Nakama] getProducts() failed — using static fallback.", err);
    return [];
  }
}

/**
 * Fetch a single WooCommerce product by slug.
 * Returns null if not found or on any error.
 */
export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  try {
    const data = await fetchGraphQL<ProductData>(
      GET_PRODUCT_BY_SLUG,
      { slug },
      3600
    );
    return data.product ?? null;
  } catch (err) {
    console.error(
      `[Nakama] getProductBySlug("${slug}") failed — using static fallback.`,
      err
    );
    return null;
  }
}
