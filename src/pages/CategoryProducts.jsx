import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/CategoryProducts.css";

const MOCK_PRODUCTS = [
  // --- MEN ---
  { id: 1, name: "Premium Oversized Tee", category: "Men", price: 1299, original_price: 1899, discount: 30, sizes: ["M", "L", "XL"], stock: 15, images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800"] },
  { id: 2, name: "Classic Linen Shirt", category: "Men", price: 2499, original_price: 3500, discount: 25, sizes: ["S", "M", "L"], stock: 8, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800"] },
  { id: 3, name: "Straight Fit Chinos", category: "Men", price: 1899, original_price: 2200, discount: 15, sizes: ["L", "XL", "XXL"], stock: 12, images: ["https://images.unsplash.com/photo-1473966968600-fa804b86829b?q=80&w=800"] },
  { id: 4, name: "Urban Utility Jacket", category: "Men", price: 3499, original_price: 4999, discount: 40, sizes: ["XL", "XXL"], stock: 5, images: ["https://images.unsplash.com/photo-1591047134402-23bbdddf4874?q=80&w=800"] },
  
  // --- WOMEN ---
  { id: 101, name: "Silk Wrap Dress", category: "Women", price: 4299, original_price: 5500, discount: 22, sizes: ["XS", "S", "M"], stock: 10, images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680fe0a?q=80&w=800"] },
  { id: 102, name: "High-Waist Trousers", category: "Women", price: 2899, original_price: 3200, discount: 10, sizes: ["S", "M", "L"], stock: 18, images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800"] },
  { id: 103, name: "Boho Knit Cardigan", category: "Women", price: 1999, original_price: 2499, discount: 20, sizes: ["M", "L", "XL"], stock: 0, images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800"] },
  
  // --- ACCESSORIES ---
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

  // 1. Initial Category Filter
  useEffect(() => {
    window.scrollTo(0, 0);
    const categoryMatch = MOCK_PRODUCTS.filter(
      p => p.category.toLowerCase() === categoryName?.toLowerCase()
    );
    setBaseProducts(categoryMatch);
    setFilteredProducts(categoryMatch);
    setSelectedSize(""); // Reset size filter when switching categories
  }, [categoryName]);

  // 2. Handle Secondary Filtering & Sorting
  useEffect(() => {
    let result = [...baseProducts];

    if (selectedSize) {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    if (sortBy === "Price: Low-High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High-Low") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [selectedSize, sortBy, baseProducts]);

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="category-container">
        {/* --- HEADER --- */}
        <header className="category-page-header">
          <nav className="breadcrumb-nav">
            <span onClick={() => navigate("/")} className="crumb-link">Home</span>
            <span className="separator">/</span>
            <span className="current-page">{categoryName}</span>
          </nav>
          
          <div className="header-flex">
            <h1 className="main-title">
              {categoryName} <span className="item-count">{filteredProducts.length} Pieces</span>
            </h1>
            <div className="utility-bar">
              <div className="sort-box">
                <label>Sort By</label>
                <select 
                  className="ghost-select" 
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
          {/* --- SIDEBAR FILTERS --- */}
          <aside className="filter-sidebar">
            <div className="filter-sticky">
              <div className="filter-header-row">
                <SlidersHorizontal size={16} />
                <h3>Filters</h3>
              </div>

              <div className="filter-group">
                <div className="filter-label-row">
                  <span className="group-name">Size</span>
                  {selectedSize && (
                    <button className="text-clear" onClick={() => setSelectedSize("")}>
                      Reset
                    </button>
                  )}
                </div>
                <div className="luxury-size-grid">
                  {sizes.map(size => (
                    <button 
                      key={size} 
                      className={`size-chip ${selectedSize === size ? 'is-active' : ''}`}
                      onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <span className="group-name">Price</span>
                <div className="luxury-check-list">
                  <label className="checkbox-item">
                    <input type="checkbox" />
                    <span className="check-label">Under ₹1,500</span>
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" />
                    <span className="check-label">Above ₹3,000</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <main className="product-listing">
            <div className="boutique-grid">
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  className="item-card" 
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="item-media">
                    {p.discount && <div className="promo-badge">-{p.discount}%</div>}
                    <button 
                      className="heart-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add wishlist logic here later
                      }}
                    >
                      <Heart size={18} />
                    </button>
                    <img src={p.images[0]} alt={p.name} loading="lazy" />
                    <div className="hover-cta">View Product</div>
                  </div>
                  <div className="item-details">
                    <p className="item-brand">TAGTURN Essential</p>
                    <h3 className="item-name">{p.name}</h3>
                    <div className="item-pricing">
                      <span className="price-now">₹{p.price.toLocaleString()}</span>
                      {p.original_price && (
                        <span className="price-was">₹{p.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <p>No matches found in "{categoryName}" for your selection.</p>
                <button onClick={() => setSelectedSize("")} className="outline-btn">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}