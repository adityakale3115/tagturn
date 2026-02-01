import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Heart, SlidersHorizontal, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/CategoryProducts.css";

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [baseProducts, setBaseProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  /* ================= FETCH FROM FIRESTORE ================= */
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      
      try {
        // 1. Normalize Casing: URL "shirt" -> DB "Shirt"
        const formattedCategory = 
          categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();

        // 2. Query Firestore based on the 'category' field in your screenshot
        const q = query(
          collection(db, "products"), 
          where("category", "==", formattedCategory)
        );

        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBaseProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Firestore Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) fetchCategoryProducts();
    setSelectedSize(""); 
  }, [categoryName]);

  /* ================= CLIENT-SIDE FILTERING & SORTING ================= */
  useEffect(() => {
    let result = [...baseProducts];
    
    if (selectedSize) {
      result = result.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }
    
    if (sortBy === "Price: Low-High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High-Low") {
      result.sort((a, b) => b.price - a.price);
    }
    
    setFilteredProducts(result);
  }, [selectedSize, sortBy, baseProducts]);

  return (
    <div className="stealth-page-wrapper">
      <Navbar />
      
      <div className="category-container">
        {/* --- HEADER --- */}
        <header className="category-page-header">
          <nav className="breadcrumb-stealth">
            <span onClick={() => navigate("/")} style={{cursor: 'pointer'}}>HOME</span>
            <ChevronRight size={12} />
            <span className="active-crumb">{categoryName?.toUpperCase()}</span>
          </nav>
          
          <div className="header-flex">
            <h1 className="main-title">
              {categoryName?.toUpperCase()} 
              {!loading && <span className="item-count">{filteredProducts.length} ARTICLES</span>}
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
          {/* --- SIDEBAR --- */}
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
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <main className="product-listing-stealth">
            {loading ? (
              <div className="loading-state-stealth" style={{textAlign: 'center', marginTop: '50px'}}>
                <Loader2 className="spinner-neon" size={40} style={{animation: 'spin 1s linear infinite'}} />
                <p style={{color: 'var(--primary)', marginTop: '15px'}}>SYNCING ARCHIVE...</p>
              </div>
            ) : (
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
                      {/* Accessing the first image from your 'images' array in Firestore */}
                      <img src={p.images?.[0]} alt={p.name} loading="lazy" />
                      <div className="hover-cta-stealth">EXPLORE ARTICLE</div>
                    </div>
                    
                    <div className="item-details-stealth">
                      <p className="item-label-stealth">TAGTURN // AUTHENTIC</p>
                      <h3 className="item-name-stealth">{p.name}</h3>
                      <div className="item-pricing-stealth">
                        <span className="price-now-stealth">₹{p.price?.toLocaleString()}</span>
                        {p.original_price && (
                          <span className="price-was-stealth">₹{p.original_price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="empty-state-dark" style={{textAlign: 'center', padding: '100px 0'}}>
                <p>NULL_RESULT: NO MATCHES FOUND FOR "{categoryName?.toUpperCase()}"</p>
                <button onClick={() => setSelectedSize("")} className="outline-btn-neon" style={{marginTop: '20px'}}>
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