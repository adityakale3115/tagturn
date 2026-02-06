import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HeroSlider.css";

export default function HeroSlider() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000, // Slightly slower for a more premium feel
    fade: true,
    speed: 1000,
    arrows: false,
    pauseOnHover: false
  };

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070",
      tag: "TAGTURN // SS26",
      title: "TAGTURN",
      desc: "TIMELESS ELEGANCE MEETS MODERN SILHOUETTES"
    },
    {
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
      tag: "ARCHIVE // NO. 04",
      title: "ARCHIVE",
      desc: "CURATED TEXTILES IN ORGANIC HUES"
    }
  ];

  return (
    <section className="asymmetric-hero">
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <div key={index} className="hero-slide-wrap">
            <div className="bg-title-wrap">
              <h1 className="bg-title">{slide.title}</h1>
            </div>
            
            <div className="hero-main-flex">
              <div className="floating-img-box">
                <img src={slide.img} alt="High Fashion" />
                <div className="img-caption">{slide.tag}</div>
              </div>

              <div className="hero-text-side">
                <p className="hero-desc">{slide.desc}</p>
                <div className="cta-group">
                  <button className="stealth-btn">DISCOVER NOW</button>
                  <button className="link-btn">EXPLORE LOOKBOOK</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}