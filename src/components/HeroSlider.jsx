import Slider from "react-slick";
import banner from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HeroSlider.css";

export default function HeroSlider() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    arrows: false,
    speed: 700,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings} className="hero-wrapper">
      {/* Slide 1 */}
      <div className="hero-slide">
        <img src={banner} alt="banner" className="hero-image" />
      </div>

      {/* Slide 2 (same image as requested) */}
      <div className="hero-slide">
        <img src={banner2} alt="banner-2" className="hero-image" />
      </div>
    </Slider>
  );
}
