import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import Features from "../components/Features";
import RandomProduct from "../components/RandomProduct"; // 👈 Renamed import
import ExploreCategories from "../components/ExploreCategories";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="main-layout">
      <Navbar /> 
      <main>
        <HeroSlider />
        <Features />

        {/* The new Random Products section */}
        <RandomProduct /> 

        <section className="content-wrapper">
           <ExploreCategories />
        </section>
      </main>
      <Footer />
    </div>
  );
}