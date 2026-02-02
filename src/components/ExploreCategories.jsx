import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; 
import "../styles/ExploreCategories.css";

export default function ExploreCategories() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Mens");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const tabs = ["Mens", "Womens", "Accessories"];

  const fetchCategories = async (section) => {
    setLoading(true);
    try {
      const categoriesRef = collection(db, "categories");
      const q = query(
        categoriesRef,
        where("parentSection", "==", section),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(fetchedData);
    } catch (error) {
      console.error("❌ Firestore Fetch Error!", error.code, error.message);
    } finally {
      // Small delay to ensure the preloader is visible during fast transitions
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchCategories(activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsVisible(false);
    setTimeout(() => {
      setActiveTab(tab);
      setIsVisible(true);
    }, 300);
  };

  return (
    <section id="collections" className="explore-section">
      <div className="explore-header">
        <span className="section-tag">{`// SELECT ARCHIVE`}</span>
        <h2 className="section-title">Collections</h2>
      </div>

      <div className="explore-container">
        <div className="explore-sidebar">
          <ul className="explore-list">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`explore-list-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                <span className="tab-text">
                  {tab === "Mens" ? "MEN" : tab === "Womens" ? "WOMEN" : tab}
                </span>
                <span className="tab-line"></span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`explore-modern-grid ${isVisible ? "fade-in" : "fade-out"}`}>
          {loading ? (
            /* ================= TAGTURN PRELOADER ================= */
            <div className="tagturn-preloader">
              <div className="loader-content">
                <h2 className="loader-text">TAGTURN</h2>
                <div className="loader-bar"></div>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
               <p>No categories found for "{activeTab}".</p>
            </div>
          ) : (
            categories.map((item, index) => (
              <div
                key={item.id}
                className="modern-card"
                style={{ "--delay": `${index * 0.1}s` }}
                onClick={() => navigate(`/category/${item.name.toLowerCase()}`)}
              >
                <div className="card-inner">
                  <img src={item.image} alt={item.name} className="card-img" />
                  <div className="card-overlay">
                    <div className="card-meta">
                      <span className="item-qty">VIEW ALL</span>
                      <h3 className="item-name">{item.name}</h3>
                    </div>
                    <div className="card-go">
                      <div className="go-circle">→</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}