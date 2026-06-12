/**
 * WooCommerce convenience re-exports.
 * Import product functions and types from here in page/component files.
 *
 * Note: Order submission still goes through WhatsApp/contact — no checkout API needed.
 */

export type { WCProduct, AccessoryProduct } from "./wordpress";
export { getProducts, getProductBySlug, getAccessoriesProducts, stripHtml, formatPrice } from "./wordpress";
