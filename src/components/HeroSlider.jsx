import "./../styles/HeroSlider.css";
import Slider from "react-slick";
import banner from "../assets/images/banner1.jpg";

export default function HeroSlider() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    arrows: false,
    speed: 800
  };

  return (
    <Slider {...settings}>
      <div className="hero-slide">
        <img src={banner} className="hero-image" alt="banner" />
        <div className="hero-text">
          <h2>Elevate Your Style</h2>
          <button>SHOP NOW</button>
        </div>
      </div>
    </Slider>
  );
}
