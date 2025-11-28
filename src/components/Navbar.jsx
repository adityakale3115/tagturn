import "./../styles/Navbar.css";
import { FiSearch, FiMenu, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthListener();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleProfileClick = () => {
    if (user) navigate("/profile");
    else navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-left">
          <FiMenu 
            size={22} 
            style={{ cursor: "pointer" }} 
            onClick={() => setSidebarOpen(true)} 
          />
          <FiSearch size={22} />
        </div>

        <h1 className="nav-logo" onClick={() => navigate("/")}>TAGTURN</h1>

        <div className="nav-right">
          <FiHeart size={22} />

          {/* Cart Icon - now clickable */}
          <FiShoppingCart 
            size={22} 
            style={{ cursor: "pointer" }} 
            onClick={() => navigate("/cart")}
          />

          {/* Dynamic profile logic */}
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="profile"
              className="profile-img"
              onClick={handleProfileClick}
            />
          ) : (
            <FiUser 
              size={22} 
              style={{ cursor:"pointer" }} 
              onClick={handleProfileClick} 
            />
          )}
        </div>
      </div>

      {sidebarOpen && (
        <>
          <div 
            className="sidebar-overlay" 
            onClick={() => setSidebarOpen(false)}
          ></div>

          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </>
      )}
    </>
  );
}
