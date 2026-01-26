import React from 'react';
import Slider from "react-slick";

// Styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HeroSlider.css";

// Static Assets
const banner1 = "https://images.unsplash.com/photo-1490481658327-4772827d0779?q=80&w=2070&auto=format&fit=crop";
const banner2 = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop";

export default function HeroSlider() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true, 
    speed: 1500,
    arrows: false,
    pauseOnHover: false,
  };

  const slides = [
    {
      img: banner1,
      subtitle: "New Collection 2026",
      title: "NO BAD ANGLES.",
      cta: "Shop the Look"
    },
    {
      img: banner2,
      subtitle: "Urban Essentials",
      title: "STREET ELEGANCE.",
      cta: "Explore Now"
    }
  ];

  return (
    <section className="hero-section">
      <Slider {...sliderSettings} className="hero-wrapper">
        {slides.map((slide, index) => (
          <div key={index} className="hero-slide">
            <div className="hero-overlay">
              <div className="hero-content">
                <span className="hero-subtitle">{slide.subtitle}</span>
                <h2 className="hero-title">{slide.title}</h2>
                <button className="hero-btn">{slide.cta}</button>
              </div>
            </div>
            <img src={slide.img} alt="TAGTURN" className="hero-img" />
          </div>
        ))}
      </Slider>
    </section>
  );
}