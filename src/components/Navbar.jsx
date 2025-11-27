import "./../styles/Navbar.css";
import { FiSearch, FiMenu, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-left">
        <FiMenu size={22} />
        <FiSearch size={22} />
      </div>

      <h1 className="nav-logo">TAGTURN</h1>

      <div className="nav-right">
        <FiUser size={22} />
        <FiHeart size={22} />
        <FiShoppingCart size={22} />
      </div>
    </div>
  );
}
