import React, { useState, useEffect } from "react";
import "./../styles/Navbar.css";
import { FiUser, FiHeart, FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // For tracking session
import { useCart } from "../context/CartContext";

export default function DarkNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Track the active session
  const [loading, setLoading] = useState(true); // Prevent jumpy redirects
  
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const auth = getAuth();

  // 1. Listen for Auth Session changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup
  }, [auth]);

  // 2. Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. User Icon Click Logic (The Redirect)
  const handleUserClick = () => {
    setMenuOpen(false);
    if (loading) return; // Wait until firebase checks session

    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      {/* Mobile Menu Toggle */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      {/* Brand Logo */}
      <div className="nav-left" onClick={() => handleNav("/")}>
        TAGTURN
      </div>

      {/* Navigation Links (Center) */}
      <div className={`nav-center ${menuOpen ? "active" : ""}`}>
        <span className="nav-link" onClick={() => handleNav("/new")}>NEW DROPS</span>
        <span className="nav-link" onClick={() => handleNav("/collections")}>COLLECTIONS</span>
        <span className="nav-link" onClick={() => handleNav("/lookbook")}>LOOKBOOK</span>
        
        {/* Icons visible ONLY inside mobile menu */}
        <div className="mobile-only-icons">
           <FiHeart className="nav-icon" />
           <FiUser className="nav-icon" onClick={handleUserClick} />
        </div>
      </div>

      {/* Action Icons (Right) */}
      <div className="nav-right">
        <div className="search-container hide-mobile">
          <FiSearch size={16} />
          <input type="text" placeholder="Search..." />
        </div>

        <FiHeart className="nav-icon hide-mobile" />
        
        <div className="cart-wrapper" onClick={() => handleNav("/cart")}>
          <FiShoppingCart className="nav-icon" />
          {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
        </div>
        
        {/* User Icon for Desktop */}
        <FiUser className="nav-icon hide-mobile" onClick={handleUserClick} />
      </div>
    </nav>
  );
}