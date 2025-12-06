import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import ExploreCategories from "../components/ExploreCategories";

export default function HomePage() {
  return (
    <>
      {/* <Navbar /> */}
      <HeroSlider />
      <ExploreCategories />
      <Footer />
    </>
  );
}
