import { getProductBySlug, getAccessoriesProducts } from "@/lib/wordpress";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; qty?: string }>;
}) {
  const { product, qty } = await searchParams;
  const initialSlug = product === "white-dragon" ? "white-dragon" : "black-dragon";
  const initialQty  = Math.max(1, Math.min(20, parseInt(qty ?? "1", 10) || 1));

  const [wcBlack, wcWhite, accessories] = await Promise.all([
    getProductBySlug("black-dragon"),
    getProductBySlug("white-dragon"),
    getAccessoriesProducts(),
  ]);

  return (
    <CheckoutClient
      initialSlug={initialSlug}
      initialQty={initialQty}
      wcBlack={wcBlack}
      wcWhite={wcWhite}
      accessories={accessories}
    />
  );
}
