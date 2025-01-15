import AsSeenInSection from "@/components/AsSeenInSection";
import HeroSection from "@/components/HeroSection";
import MainLandingSection from "@/components/MainLandingSection";
import ProductCardGrid from "@/components/ProductCardGrid";
import TrendingProducts from "@/components/TrendingProducts";

function Home() {
  return (
    <>
      <HeroSection />
      <ProductCardGrid />
      <MainLandingSection />
      <TrendingProducts />
      <AsSeenInSection />
    </>
  );
}

export default Home;
