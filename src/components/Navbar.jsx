import React, { useState, useEffect } from "react";
import "./../styles/Navbar.css";
import { FiUser, FiHeart, FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore";

export default function EditorialNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]); 
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const { cartItems } = useCart();
  const auth = getAuth();

  // --- Backend: Fetch Products for Search ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // --- Backend: Auth Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // --- Logic: Search Suggestions ---
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); 
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  // --- Logic: Scroll Effect ---
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
      setMenuOpen(false);
    }
  };

  const handleNav = (path) => {
    setMenuOpen(false);
    if (path === "/collections" && window.location.pathname === "/") {
      document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      {/* HAMBURGER: Only visible on mobile via CSS */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      <div className="nav-left" onClick={() => handleNav("/")}>TAGTURN</div>

      <div className={`nav-center ${menuOpen ? "active" : ""}`}>
        <span className="nav-link" onClick={() => handleNav("/new")}>NEW DROPS</span>
        <span className="nav-link" onClick={() => handleNav("/collections")}>COLLECTIONS</span>
        <span className="nav-link" onClick={() => handleNav("/lookbook")}>LOOKBOOK</span>
        
        {/* MOBILE ICONS: Hidden on Desktop */}
        <div className="mobile-only-icons">
          <FiHeart className="nav-icon" onClick={() => handleNav("/wishlist")} />
          <FiUser className="nav-icon" onClick={() => user ? handleNav("/profile") : handleNav("/login")} />
        </div>
      </div>

      <div className="nav-right">
        {/* SEARCH: Hidden on Mobile */}
        <div className="search-container hide-mobile">
          <FiSearch size={16} onClick={handleSearch} style={{ cursor: "pointer" }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
            onFocus={() => searchQuery && setShowSuggestions(true)}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((item) => (
                <div key={item.id} className="suggestion-item" onClick={() => {
                  navigate(`/product/${item.id}`);
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}>
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

        <FiHeart className="nav-icon hide-mobile" onClick={() => navigate("/wishlist")} />
        
        <div className="cart-wrapper" onClick={() => navigate("/cart")}>
          <FiShoppingCart className="nav-icon" />
          {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
        </div>
        
        <FiUser className="nav-icon hide-mobile" onClick={() => user ? navigate("/profile") : navigate("/login")} />
      </div>
    </nav>
  );
}