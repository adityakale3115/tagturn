import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExploreCategories.css";

const COLLECTION_DATA = {
  Men: [
    { id: "m1", name: "Oversized Tees", count: "12 Items", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600" },
    { id: "m2", name: "Premium Shirts", count: "08 Items", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600" },
    { id: "m3", name: "Cargo Pants", count: "15 Items", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600" },
    { id: "m4", name: "Denim Jeans", count: "10 Items", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600" },
  ],
  Women: [
    { id: "w1", name: "Crop Tops", count: "20 Items", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600" },
    { id: "w2", name: "Elegant Kurtis", count: "14 Items", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
    { id: "w3", name: "Dresses", count: "09 Items", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600" },
    { id: "w4", name: "High Rise", count: "11 Items", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600" },
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
