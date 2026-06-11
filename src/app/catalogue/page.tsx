import { getProducts } from "@/lib/wordpress";
import CatalogueClient from "./CatalogueClient";

export default async function CataloguePage() {
  // Fetch WooCommerce products server-side.
  // getProducts() returns [] on any error — CatalogueClient falls back to static data.
  const wcProducts = await getProducts();
  return <CatalogueClient wcProducts={wcProducts} />;
}
