import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, SlidersHorizontal, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/CategoryProducts.css";

const MOCK_PRODUCTS = [
  // ... (Keep all your existing MOCK_PRODUCTS here) ...
  { id: 1, name: "Premium Oversized Tee", category: "Men", price: 1299, original_price: 1899, discount: 30, sizes: ["M", "L", "XL"], stock: 15, images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800"] },
  { id: 2, name: "Classic Linen Shirt", category: "Men", price: 2499, original_price: 3500, discount: 25, sizes: ["S", "M", "L"], stock: 8, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800"] },
  { id: 3, name: "Straight Fit Chinos", category: "Men", price: 1899, original_price: 2200, discount: 15, sizes: ["L", "XL", "XXL"], stock: 12, images: ["https://images.unsplash.com/photo-1473966968600-fa804b86829b?q=80&w=800"] },
  { id: 4, name: "Urban Utility Jacket", category: "Men", price: 3499, original_price: 4999, discount: 40, sizes: ["XL", "XXL"], stock: 5, images: ["https://images.unsplash.com/photo-1591047134402-23bbdddf4874?q=80&w=800"] },
  { id: 101, name: "Silk Wrap Dress", category: "Women", price: 4299, original_price: 5500, discount: 22, sizes: ["XS", "S", "M"], stock: 10, images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680fe0a?q=80&w=800"] },
  { id: 102, name: "High-Waist Trousers", category: "Women", price: 2899, original_price: 3200, discount: 10, sizes: ["S", "M", "L"], stock: 18, images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800"] },
  { id: 103, name: "Boho Knit Cardigan", category: "Women", price: 1999, original_price: 2499, discount: 20, sizes: ["M", "L", "XL"], stock: 0, images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800"] },
  { id: 201, name: "Leather Wallet", category: "Accessories", price: 899, original_price: 1200, discount: 25, sizes: ["One Size"], stock: 50, images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800"] },
  { id: 202, name: "Aviator Shades", category: "Accessories", price: 1599, original_price: 1999, discount: 20, sizes: ["One Size"], stock: 25, images: ["https://images.unsplash.com/photo-1511499767390-90342f5b89a7?q=80&w=800"] }
];

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [baseProducts, setBaseProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    window.scrollTo(0, 0);
    const categoryMatch = MOCK_PRODUCTS.filter(
      p => p.category.toLowerCase() === categoryName?.toLowerCase()
    );
    setBaseProducts(categoryMatch);
    setFilteredProducts(categoryMatch);
    setSelectedSize(""); 
  }, [categoryName]);

  useEffect(() => {
    let result = [...baseProducts];
    if (selectedSize) result = result.filter(p => p.sizes.includes(selectedSize));
    
    if (sortBy === "Price: Low-High") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High-Low") result.sort((a, b) => b.price - a.price);
    
    setFilteredProducts(result);
  }, [selectedSize, sortBy, baseProducts]);

  return (
    
    <div className="stealth-page-wrapper">
      <Navbar />
      
      <div className="category-container">
        {/* --- HEADER --- */}
        <header className="category-page-header">
          <nav className="breadcrumb-stealth">
            <span onClick={() => navigate("/")}>HOME</span>
            <ChevronRight size={12} />
            <span className="active-crumb">{categoryName}</span>
          </nav>
          
          <div className="header-flex">
            <h1 className="main-title">
              {categoryName} <span className="item-count">{filteredProducts.length} ARTICLES</span>
            </h1>
            <div className="utility-bar">
              <div className="sort-box-stealth">
                <label>SORT BY</label>
                <select 
                  className="ghost-select-dark" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Newest</option>
                  <option>Price: Low-High</option>
                  <option>Price: High-Low</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <div className="category-main-content">
          {/* --- GLASS SIDEBAR --- */}
          <aside className="filter-sidebar-stealth">
            <div className="filter-sticky-box">
              <div className="filter-header-stealth">
                <SlidersHorizontal size={14} />
                <h3>FILTERS</h3>
              </div>

              <div className="filter-group-dark">
                <div className="filter-label-row">
                  <span className="group-name">SIZES</span>
                  {selectedSize && (
                    <button className="text-clear-neon" onClick={() => setSelectedSize("")}>
                      RESET
                    </button>
                  )}
                </div>
                <div className="stealth-size-grid">
                  {sizes.map(size => (
                    <button 
                      key={size} 
                      className={`size-chip-dark ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group-dark">
                <span className="group-name">PRICE RANGE</span>
                <div className="stealth-check-list">
                  <label className="checkbox-item-dark">
                    <input type="checkbox" />
                    <span className="check-text">Under ₹1,500</span>
                  </label>
                  <label className="checkbox-item-dark">
                    <input type="checkbox" />
                    <span className="check-text">Above ₹3,000</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <main className="product-listing-stealth">
            <div className="boutique-grid-dark">
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  className="item-card-stealth" 
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="item-media-stealth">
                    {p.discount && <div className="promo-badge-neon">-{p.discount}%</div>}
                    <button 
                      className="heart-trigger-glass"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart size={18} />
                    </button>
                    <img src={p.images[0]} alt={p.name} loading="lazy" />
                    <div className="hover-cta-stealth">EXPLORE ARTICLE</div>
                  </div>
                  
                  <div className="item-details-stealth">
                    <p className="item-label-stealth">TAGTURN // ESSENTIAL</p>
                    <h3 className="item-name-stealth">{p.name}</h3>
                    <div className="item-pricing-stealth">
                      <span className="price-now-stealth">₹{p.price.toLocaleString()}</span>
                      {p.original_price && (
                        <span className="price-was-stealth">₹{p.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state-dark">
                <p>NO MATCHES FOUND FOR "{categoryName}"</p>
                <button onClick={() => setSelectedSize("")} className="outline-btn-neon">
                  CLEAR ALL FILTERS
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}