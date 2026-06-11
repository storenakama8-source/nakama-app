import { getProductBySlug } from "@/lib/wordpress";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const slug = product === "white-dragon" ? "white-dragon" : "black-dragon";
  const wcProduct = await getProductBySlug(slug);

  return <CheckoutClient slug={slug} wcProduct={wcProduct} />;
}
