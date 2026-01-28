import React, { useState, useEffect } from "react";
import "./../styles/Navbar.css";
import { FiUser, FiHeart, FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DarkNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu and navigate
  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      {/* Mobile Menu Icon */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      <div className="nav-left" onClick={() => handleNav("/")}>
        TAGTURN
      </div>

      {/* Navigation Overlay */}
      <div className={`nav-center ${menuOpen ? "active" : ""}`}>
        <span className="nav-link" onClick={() => handleNav("/new")}>NEW DROPS</span>
        <span className="nav-link" onClick={() => handleNav("/collections")}>COLLECTIONS</span>
        <span className="nav-link" onClick={() => handleNav("/lookbook")}>LOOKBOOK</span>
        
        {/* Mobile-only Icons inside menu */}
        <div className="mobile-only-icons">
           <FiHeart className="nav-icon" />
           <FiUser className="nav-icon" />
        </div>
      </div>

      <div className="nav-right">
        {/* Desktop Search Pill */}
        <div className="search-container hide-mobile">
          <FiSearch size={16} />
          <input type="text" placeholder="Search..." />
        </div>

        <FiHeart className="nav-icon hide-mobile" />
        
        <div className="cart-wrapper" onClick={() => handleNav("/cart")}>
          <FiShoppingCart className="nav-icon" />
          <span className="badge">3</span>
        </div>
        
        <FiUser className="nav-icon hide-mobile" />
      </div>
    </nav>
  );
}