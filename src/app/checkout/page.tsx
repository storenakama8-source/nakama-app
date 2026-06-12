import { getProductBySlug } from "@/lib/wordpress";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; qty?: string }>;
}) {
  const { product, qty } = await searchParams;
  const slug       = product === "white-dragon" ? "white-dragon" : "black-dragon";
  const initialQty = Math.max(1, Math.min(20, parseInt(qty ?? "1", 10) || 1));
  const wcProduct  = await getProductBySlug(slug);

  return <CheckoutClient slug={slug} wcProduct={wcProduct} initialQty={initialQty} />;
}
