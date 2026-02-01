import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiGrid,
  FiChevronDown,
  FiHome,
  FiX
} from "react-icons/fi";
import { useState } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  // 🔹 Static categories (demo)
  const [categories] = useState([
    { id: 1, name: "Men" },
    { id: 2, name: "Women" },
    { id: 3, name: "Accessories" }
  ]);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* HEADER */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">T A G T U R N</h2>
          <FiX size={24} className="sidebar-close-icon" onClick={onClose} />
        </div>

        {/* HOME */}
        <div
          className="sidebar-item"
          onClick={() => {
            navigate("/");
            onClose();
          }}
        >
          <FiHome size={18} /> Home
        </div>

        {/* CATEGORY DROPDOWN */}
        <div
          className="sidebar-item dropdown-toggle"
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FiGrid size={18} /> Explore By Category
          </div>
          <FiChevronDown
            size={14}
            className={showCategoryDropdown ? "rotate" : ""}
          />
        </div>

        {/* CATEGORY LIST */}
        {showCategoryDropdown && (
          <div className="dropdown-list">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="dropdown-item"
                onClick={() => {
                  navigate(`/category/${cat.name}`);
                  onClose();
                }}
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}

        <hr className="sidebar-divider" />

        {/* STATIC LOGIN */}
        <div
          className="sidebar-item"
          onClick={() => {
            navigate("/login");
            onClose();
          }}
        >
          <FiUser size={18} /> Login / Register
        </div>
      </div>
    </>
  );
}
