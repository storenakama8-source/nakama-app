/**
 * WooCommerce convenience re-exports.
 * Import product functions and types from here in page/component files.
 *
 * Note: Order submission still goes through WhatsApp/contact — no checkout API needed.
 */

export type { WCProduct } from "./wordpress";
export { getProducts, getProductBySlug, stripHtml, formatPrice } from "./wordpress";
