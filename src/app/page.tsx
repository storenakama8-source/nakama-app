import HeroSection from "@/components/sections/HeroSection";
import HomeCollection from "@/components/sections/HomeCollection";
import HomeCraft from "@/components/sections/HomeCraft";
import { getProductBySlug } from "@/lib/wordpress";

export default async function Home() {
  const product = await getProductBySlug("black-dragon");
  const heroImageUrl = product?.image?.sourceUrl ?? null;

  return (
    <>
      <HeroSection heroImageUrl={heroImageUrl} />
      <HomeCollection />
      <HomeCraft />
    </>
  );
}
