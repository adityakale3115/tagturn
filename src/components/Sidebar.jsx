import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { FiUser, FiLogOut, FiLayers, FiShoppingBag, FiGrid } from "react-icons/fi";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = useAuthListener();

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

        {!user && (
          <div className="sidebar-item" onClick={() => navigate("/login")}>
            <FiUser size={18} /> Login / Register
          </div>
        )}

        {user && (
          <div className="sidebar-item" onClick={() => navigate("/profile")}>
            <FiUser size={18} /> My Account
          </div>
        )}

        {user && (
          <>
            <hr className="sidebar-divider" />
            <div
              className="sidebar-item logout"
              onClick={() => {
                import("firebase/auth").then(({ getAuth }) => {
                  getAuth().signOut();
                  onClose();
                  navigate("/");
                });
              }}
            >
              <FiLogOut size={18} /> Logout
            </div>
          </>
        )}
      </div>
    </>
  );
}
