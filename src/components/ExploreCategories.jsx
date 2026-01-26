import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExploreCategories.css";

const COLLECTION_DATA = {
  Men: [
    { id: "m1", name: "Oversized Tees", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600" },
    { id: "m2", name: "Premium Shirts", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600" },
    { id: "m3", name: "Cargo Pants", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600" },
    { id: "m4", name: "Denim Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600" },
  ],
  Women: [
    { id: "w1", name: "Crop Tops", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600" },
    { id: "w2", name: "Elegant Kurtis", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600" },
    { id: "w3", name: "Dresses", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600" },
    { id: "w4", name: "High Rise", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600" },
  ],
  Accessories: [
    { id: "a1", name: "Watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600" },
    { id: "a2", name: "Leather Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600" },
  ]
};

export default function ExploreCategories() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Men");

  /**
   * REDIRECTION LOGIC
   * We navigate to the 'activeTab' (Men/Women/Accessories) 
   * so CategoryProducts.jsx can filter the MOCK_PRODUCTS array correctly.
   */
  const handleRedirection = () => {
    // Navigate to /category/Men, /category/Women, etc.
    navigate(`/category/${activeTab}`);
    
    // Smooth scroll to top ensures user starts at the top of the product listing
    window.scrollTo({ top: 0, behavior: "instant" }); 
  };

  return (
    <section className="explore-section">
      <div className="explore-container">
        
        {/* SIDEBAR */}
        <div className="explore-sidebar">
          <h2 className="explore-sidebar-title">Collections</h2>
          <ul className="explore-list">
            {Object.keys(COLLECTION_DATA).map((tab) => (
              <li 
                key={tab} 
                className={`explore-list-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* SMALL CARD GRID */}
        <div className="explore-grid" key={activeTab}>
          {COLLECTION_DATA[activeTab].map((item) => (
            <div 
              key={item.id} 
              className="explore-card"
              onClick={handleRedirection} // Clicking any card in the tab goes to that Category
            >
              <div className="explore-image-wrapper">
                <img src={item.image} alt={item.name} className="explore-image" />
                <div className="explore-overlay">
                   <span className="explore-btn-text">View All</span>
                </div>
              </div>
              <div className="explore-card-info">
                 <h3 className="explore-card-name">{item.name}</h3>
                 <span className="explore-card-tag">Shop Collection</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}