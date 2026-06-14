import HeroSection from "@/components/sections/HeroSection";
import HomeCollection from "@/components/sections/HomeCollection";
import HomeCraft from "@/components/sections/HomeCraft";
import { getProductBySlug } from "@/lib/wordpress";

export default async function Home() {
  const [black, white] = await Promise.all([
    getProductBySlug("black-dragon"),
    getProductBySlug("white-dragon"),
  ]);

  const heroImageUrl = black?.image?.sourceUrl ?? null;
  const collectionImages = {
    "black-dragon": black?.image?.sourceUrl ?? null,
    "white-dragon": white?.image?.sourceUrl ?? null,
  };

  return (
    <>
      <HeroSection heroImageUrl={heroImageUrl} />
      <HomeCollection images={collectionImages} />
      <HomeCraft />
    </>
  );
}
