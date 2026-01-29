import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExploreCategories.css";

import men1 from '../assets/cat/over.png'
import men2 from '../assets/cat/shirts.png'
import men3 from '../assets/cat/cargo.png'
import men4 from '../assets/cat/jeans.png'

import women1 from '../assets/cat/top.png'
import women2 from '../assets/cat/kurti.png'
import women3 from '../assets/cat/high.png'
import women4 from '../assets/cat/west.png'

const COLLECTION_DATA = {
  Men: [
    { id: "m1", name: "Oversized Tees", count: "12 Items", image: men1 },
    { id: "m2", name: "Premium Shirts", count: "08 Items", image: men2 },
    { id: "m3", name: "Cargo Pants", count: "15 Items", image: men3 },
    { id: "m4", name: "Denim Jeans", count: "10 Items", image: men4 },
  ],
  Women: [
    { id: "w1", name: "Crop Tops", count: "20 Items", image: women1 },
    { id: "w2", name: "Elegant Kurtis", count: "14 Items", image: women2 },
    { id: "w3", name: "Dresses", count: "09 Items", image: women3 },
    { id: "w4", name: "High Rise", count: "11 Items", image: women4 },
  ],
  Accessories: [
    { id: "a1", name: "Watches", count: "05 Items", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600" },
    { id: "a2", name: "Leather Bags", count: "07 Items", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600" },
  ]
};

export default function ExploreCategories() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Men");
  const [isVisible, setIsVisible] = useState(true);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsVisible(false);
    setTimeout(() => {
      setActiveTab(tab);
      setIsVisible(true);
    }, 300);
  };

  const handleRedirection = (category) => {
    navigate(`/category/${category}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="explore-section">
      <div className="explore-header">
        <span className="section-tag">{`// SELECT ARCHIVE`}</span>
        <h2 className="section-title">Collections</h2>
      </div>

      <div className="explore-container">
        <div className="explore-sidebar">
          <ul className="explore-list">
            {Object.keys(COLLECTION_DATA).map((tab) => (
              <li
                key={tab}
                className={`explore-list-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                <span className="tab-text">{tab}</span>
                <span className="tab-line"></span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`explore-modern-grid ${isVisible ? "fade-in" : "fade-out"}`}>
          {COLLECTION_DATA[activeTab].map((item, index) => (
            <div
              key={item.id}
              className="modern-card"
              style={{ "--delay": `${index * 0.1}s` }}
              onClick={() => handleRedirection(activeTab)}
            >
              <div className="card-inner">
                <img src={item.image} alt={item.name} className="card-img" />
                <div className="card-overlay">
                  <div className="card-meta">
                    <span className="item-qty">{item.count}</span>
                    <h3 className="item-name">{item.name}</h3>
                  </div>
                  <div className="card-go">
                    <div className="go-circle">→</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
