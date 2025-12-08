import "./../styles/Navbar.css";
import { FiSearch, FiMenu, FiUser, FiHeart, FiShoppingCart, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthListener();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  // State to toggle the full search bar on mobile
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Fetch suggestion results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchResults = async () => {
      const snap = await getDocs(collection(db, "products"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = list.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSuggestions(filtered.slice(0, 5));
    };

    fetchResults();
  }, [searchQuery]);

  // Helper to handle clicking a search result
  const handleSearchNavigate = (id) => {
    navigate(`/product/${id}`);
    setSearchQuery("");
    setSuggestions([]);
    setMobileSearchOpen(false); // Close mobile search on selection
  };

  return (
    <>
      <div className="navbar">

        {/* --- CONDITION: IS MOBILE SEARCH OPEN? --- */}
        {mobileSearchOpen ? (
          /* 1. MOBILE SEARCH OVERLAY VIEW */
          <div className="nav-mobile-search-active">
            <FiSearch size={20} className="search-icon-active" />
            
            <input 
              autoFocus
              className="search-input mobile-input-style"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <FiX 
              size={24} 
              className="nav-icon" 
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery(""); // Optional: clear search on close
              }} 
            />

            {/* Mobile Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="search-dropdown mobile-dropdown-pos">
                {suggestions.map((item) => (
                  <div key={item.id} className="search-item" onClick={() => handleSearchNavigate(item.id)}>
                    <img src={item.images?.[0]} alt="" className="search-thumb" />
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 2. STANDARD NAVBAR VIEW */
          <>
            {/* LEFT: MENU ICON */}
            <div className="nav-left">
              <FiMenu 
                size={24} 
                className="nav-icon"
                onClick={() => setSidebarOpen(true)} 
              />
            </div>

            {/* CENTER: LOGO */}
            <h1 className="nav-logo" onClick={() => navigate("/")}>TAGTURN</h1>

            {/* RIGHT: SEARCH ICON (Mobile) + SEARCH BAR (Desktop) + ICONS */}
            <div className="nav-right">

              {/* A. Mobile Search Trigger (Hidden on Desktop) */}
              <FiSearch 
                size={22} 
                className="nav-icon mobile-search-trigger" 
                onClick={() => setMobileSearchOpen(true)}
              />

              {/* B. Desktop Search Container (Hidden on Mobile) */}
              <div className="nav-search-container desktop-only">
                <FiSearch size={18} className="search-icon" />
                <input 
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* Desktop Suggestions */}
                {suggestions.length > 0 && (
                  <div className="search-dropdown">
                    {suggestions.map((item) => (
                      <div key={item.id} className="search-item" onClick={() => handleSearchNavigate(item.id)}>
                        <img src={item.images?.[0]} alt="" className="search-thumb" />
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* C. Icons Group: Wishlist, Cart, Profile */}
              <div className="nav-icons-group">
                <FiHeart className="nav-icon hide-on-very-small" size={22} />
                <FiShoppingCart 
                  size={22} 
                  className="nav-icon"
                  onClick={() => navigate("/cart")}
                />

                {/* Profile Logic */}
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL}
                    alt="profile"
                    className="profile-img"
                    onClick={() => navigate("/profile")}
                  />
                ) : (
                  <FiUser 
                    size={22} 
                    className="nav-icon"
                    onClick={() => navigate(user ? "/profile" : "/login")}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}
    </>
  );
}