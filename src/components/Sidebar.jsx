import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { FiUser, FiLogOut, FiGrid, FiChevronDown, FiHome, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = useAuthListener();

  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const logout = () => {
    import("firebase/auth").then(({ getAuth }) => {
      getAuth().signOut();
      onClose();
      navigate("/");
    });
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        
        {/* HEADER: Title Center + Close Button Right */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">T A G T U R N</h2>
          <FiX size={24} className="sidebar-close-icon" onClick={onClose} />
        </div>

        {/* HOME */}
        <div className="sidebar-item" onClick={() => { navigate("/"); onClose(); }}>
          <FiHome size={18} /> Home
        </div>

        {/* CATEGORY DROPDOWN */}
        <div 
          className="sidebar-item dropdown-toggle"
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <FiGrid size={18} /> Explore By Category
          </div>
          <FiChevronDown size={14} className={showCategoryDropdown ? "rotate" : ""} />
        </div>

        {/* LIST CATEGORIES */}
        {showCategoryDropdown && (
          <div className="dropdown-list">
            {categories.length === 0 ? (
              <p className="dropdown-empty">No Categories Found</p>
            ) : (
              categories.map((cat) => (
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
              ))
            )}
          </div>
        )}

        <hr className="sidebar-divider" />

        {/* LOGIN / PROFILE */}
        {!user && (
          <div className="sidebar-item" onClick={() => { navigate("/login"); onClose(); }}>
            <FiUser size={18} /> Login / Register
          </div>
        )}

        {user && (
          <div className="sidebar-item" onClick={() => { navigate("/profile"); onClose(); }}>
            <FiUser size={18} /> My Profile
          </div>
        )}

        {/* LOGOUT */}
        {user && (
          <>
            <hr className="sidebar-divider" />
            <div className="sidebar-item logout" onClick={logout}>
              <FiLogOut size={18} /> Logout
            </div>
          </>
        )}
      </div>
    </>
  );
}