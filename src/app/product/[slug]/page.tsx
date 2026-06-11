import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/wordpress";
import ProductPageClient from "./ProductPageClient";

const VALID_SLUGS = ["black-dragon", "white-dragon"] as const;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug as (typeof VALID_SLUGS)[number])) {
    notFound();
  }

  const wcProduct = await getProductBySlug(slug);

  return <ProductPageClient slug={slug} wcProduct={wcProduct} />;
}
