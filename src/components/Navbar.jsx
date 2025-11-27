import "./../styles/Navbar.css";
import { FiSearch, FiMenu, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="nav-left">
        <FiMenu size={22} />
        <FiSearch size={22} />
      </div>

      <h1 className="nav-logo" onClick={() => navigate("/")}>TAGTURN</h1>

      <div className="nav-right">
        <FiUser size={22} style={{ cursor: "pointer" }} onClick={() => navigate("/login")} />
        <FiHeart size={22} />
        <FiShoppingCart size={22} />
      </div>
    </div>
  );
}
