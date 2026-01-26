import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import ExploreCategories from "../components/ExploreCategories";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="main-layout">
      {/* Navbar is fixed, so it sits on top of everything */}
      <Navbar /> 
      
      <main>
        <HeroSlider />
        
        {/* Added a Wrapper for section spacing */}
        <section className="content-wrapper">
           <ExploreCategories />
        </section>
        
        {/* You can add FeaturedProducts here later */}
      </main>

      <Footer />
    </div>
  );
}