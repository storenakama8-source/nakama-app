import { getProductBySlug } from "@/lib/wordpress";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; qty?: string; black?: string; white?: string }>;
}) {
  const { product, qty, black, white } = await searchParams;

  const initialSlug =
    product === "white-dragon" ? "white-dragon"
    : product === "black-dragon" ? "black-dragon"
    : null;

  const initialQty = Math.max(1, Math.min(20, parseInt(qty ?? "1", 10) || 1));

  const clampQty = (v: string | undefined) =>
    v != null ? Math.max(0, Math.min(20, parseInt(v, 10) || 0)) : null;

  const initialBlackQty = clampQty(black);
  const initialWhiteQty = clampQty(white);

  const [wcBlack, wcWhite] = await Promise.all([
    getProductBySlug("black-dragon"),
    getProductBySlug("white-dragon"),
  ]);

  return (
    <CheckoutClient
      initialSlug={initialSlug}
      initialQty={initialQty}
      initialBlackQty={initialBlackQty}
      initialWhiteQty={initialWhiteQty}
      wcBlack={wcBlack}
      wcWhite={wcWhite}
    />
  );
}
