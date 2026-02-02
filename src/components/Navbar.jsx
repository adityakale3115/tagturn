import React, { useState, useEffect } from "react";
import "./../styles/Navbar.css";
import { FiUser, FiHeart, FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore";

export default function DarkNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Store all items for filtering
  const [suggestions, setSuggestions] = useState([]); // Current matches
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const auth = getAuth();

  // 1. Fetch products once on mount to use for suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    fetchProducts();
  }, []);

  // 2. Filter suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions for UI cleanliness
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchQuery.trim() !== "") {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSelectSuggestion = (product) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(`/product/${product.id}`);
  };

 const handleNav = (path) => {
  setMenuOpen(false);

  if (path === "/collections") {
    // 1. Check if we are already on the Home page
    if (window.location.pathname === "/") {
      const element = document.getElementById("collections");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // 2. If we are on another page (like Search or Cart), go home first
      navigate("/");
      // Small delay to allow the Home page to load before scrolling
      setTimeout(() => {
        const element = document.getElementById("collections");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  } else {
    // Standard navigation for other links
    navigate(path);
  }
};

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      <div className="nav-left" onClick={() => navigate("/")}>TAGTURN</div>

      <div className={`nav-center ${menuOpen ? "active" : ""}`}>
        <span className="nav-link" onClick={() => handleNav("/new")}>NEW DROPS</span>
        <span className="nav-link" onClick={() => handleNav("/collections")}>COLLECTIONS</span>
        <span className="nav-link" onClick={() => handleNav("/lookbook")}>LOOKBOOK</span>
      </div>

      <div className="nav-right">
        {/* MODIFIED SEARCH CONTAINER WITH SUGGESTIONS */}
        <div className="search-container hide-mobile">
          <FiSearch size={16} onClick={handleSearch} style={{ cursor: "pointer" }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow clicks
            onFocus={() => searchQuery && setShowSuggestions(true)}
          />

          {/* SUGGESTIONS DROPDOWN */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((item) => (
                <div 
                  key={item.id} 
                  className="suggestion-item" 
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <img src={item.images?.[0]} alt="" className="suggestion-img" />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{item.name}</span>
                    <span className="suggestion-cat">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <FiHeart className="nav-icon hide-mobile" />
        <div className="cart-wrapper" onClick={() => navigate("/cart")}>
          <FiShoppingCart className="nav-icon" />
          {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
        </div>
        <FiUser className="nav-icon hide-mobile" onClick={() => user ? navigate("/profile") : navigate("/login")} />
      </div>
    </nav>
  );
}