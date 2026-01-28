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
    autoplaySpeed: 4000,
    fade: true,
    speed: 1000,
    arrows: false,
  };

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070",
      tag: "COLLECTION // 01",
      title: "TAGTURN",
      desc: "URBAN UTILITY & STEALTH AESTHETICS"
    },
    {
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
      tag: "COLLECTION // 02",
      title: "ARCHIVE",
      desc: "REDEFINING THE MODERN SILHOUETTE"
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
                <img src={slide.img} alt="Streetwear Model" />
                <div className="img-caption">{slide.tag}</div>
              </div>

              <div className="hero-text-side">
                <p className="hero-desc">{slide.desc}</p>
                <div className="cta-group">
                  <button className="stealth-btn">SHOP COLLECTION</button>
                  <button className="link-btn">LOOKBOOK 2026</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}