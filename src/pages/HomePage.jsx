import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import Features from "../components/Features"; // 👈 Import new section
import ExploreCategories from "../components/ExploreCategories";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="main-layout">
      <Navbar /> 
      
      <main>
        <HeroSlider />
        
        {/* New Section Added Here */}
        <Features />

        <section className="content-wrapper">
           <ExploreCategories />
        </section>
      </main>

      <Footer />
    </div>
  );
}