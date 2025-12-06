import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { FiUser, FiLogOut, FiLayers, FiShoppingBag, FiGrid } from "react-icons/fi";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = useAuthListener();

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
        
        <h2 className="sidebar-title">Browse</h2>

        <div className="sidebar-item" onClick={() => navigate("/")}>
          <FiShoppingBag size={18} /> Explore By Shops
        </div>

        <div className="sidebar-item" onClick={() => navigate("/")}>
          <FiGrid size={18} /> Explore By Category
        </div>

        <hr className="sidebar-divider" />

        {/* Show Login/Register if NOT logged in */}
        {!user && (
          <div className="sidebar-item" onClick={() => navigate("/login")}>
            <FiUser size={18} /> Login / Register
          </div>
        )}

        {/* Show profile if logged in */}
        {user && (
          <div className="sidebar-item" onClick={() => navigate("/profile")}>
            <FiUser size={18} /> My Profile
          </div>
        )}

        {/* Logout for logged in users */}
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
