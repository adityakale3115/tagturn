import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Heart } from "lucide-react";
import "../styles/CategoryProducts.css";

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPrices, setSelectedPrices] = useState([]);

  const navigate = useNavigate();

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const priceRanges = [
    { label: "Rs. 649 - Rs. 1123", min: 649, max: 1123 },
    { label: "Rs. 1124 - Rs. 1598", min: 1124, max: 1598 },
    { label: "Rs. 1599 - Rs. 2073", min: 1599, max: 2073 },
    { label: "Rs. 2074 - Rs. 2548", min: 2074, max: 2548 },
    { label: "Rs. 2549 - Rs. 3023", min: 2549, max: 3023 },
    { label: "Rs. 3024 - Rs. 3499", min: 3024, max: 3499 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("category", "==", categoryName));
        const snap = await getDocs(q);
        const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(arr);
        setFilteredProducts(arr); // initial data
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryName]);


  // ⭐ Filtering Handler
  useEffect(() => {
    let updated = [...products];

    // Filter by size
    if (selectedSize) {
      updated = updated.filter(item =>
        item.sizes?.includes(selectedSize)
      );
    }

    // Filter by price ranges
    if (selectedPrices.length > 0) {
      updated = updated.filter(item =>
        selectedPrices.some(
          (range) => item.price >= range.min && item.price <= range.max
        )
      );
    }

    setFilteredProducts(updated);
  }, [selectedSize, selectedPrices, products]);


  const togglePriceRange = (rangeObj) => {
    const exists = selectedPrices.find(r => r.label === rangeObj.label);

    if (exists) {
      setSelectedPrices(selectedPrices.filter(r => r.label !== rangeObj.label));
    } else {
      setSelectedPrices([...selectedPrices, rangeObj]);
    }
  };

  
  return (
    <div className="category-product-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <a href="/">Home</a> / <span>{categoryName}</span>
          </div>
          <h2 className="page-title">{categoryName} <span>- {filteredProducts.length} items</span></h2>
        </div>

        <select className="sort-dropdown">
          <option>Select Sorting Options</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
          <option>Best Selling</option>
        </select>
      </div>

      <div className="content-wrapper">
        
        {/* FILTER SIDEBAR */}
        <aside className="filters-sidebar">

          {/* Size Filter */}
          <div className="filter-section">
            <h3>Size</h3>
            <div className="size-option-group">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h3>Price</h3>
            {priceRanges.map((range) => (
              <label key={range.label} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPrices.some(r => r.label === range.label)}
                  onChange={() => togglePriceRange(range)}
                />
                {range.label}
              </label>
            ))}
          </div>

        </aside>


        {/* Products Grid */}
        <div className="products-container">
          {loading ? (
            <p className="loading-text">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="empty-text">No products match selected filters.</p>
          ) : (
            <div className="products-grid">
  {filteredProducts.map((p) => (
    <div
      key={p.id}
      className="product-card"
      onClick={() => navigate(`/product/${p.id}`)}
      style={{ cursor: "pointer" }}  // ensures pointer intent
    >
      {/* ❤️ Wishlist Button */}
      <button
        className="wishlist-btn"
        onClick={(e) => {
          e.stopPropagation(); // prevent redirect when clicked
          console.log("Added to wishlist");
        }}
      >
        <Heart size={18} />
      </button>

      {/* 🖼 Product Image */}
      <div className="product-img">
        <img
          src={p.images?.[0] || "/no-image.png"}
          alt={p.name}
          loading="lazy"
        />
      </div>

      {/* 📄 Product Info */}
      <div className="product-info">
        <h3>{p.name}</h3>
        <p>{p.category}</p>
        <p className="product-price">₹ {p.price}</p>
      </div>
    </div>
  ))}
</div>

          )}
        </div>

      </div>
    </div>
  );
}
