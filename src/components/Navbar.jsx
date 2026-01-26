import "./../styles/Navbar.css";
import { FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import logo from "../assets/logo.jpg"; // 👈 import logo

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthListener();

  const handleProfileClick = () => {
    if (user) navigate("/profile");
    else navigate("/login");
  };

  return (
    <div className="navbar">
      {/* Left: Logo */}
      <div className="nav-left" onClick={() => navigate("/")}>
        {/* <img src={logo} alt="logo" className="nav-logo-img" /> */}
        TagTurn
      </div>

      {/* Center: Navigation Links */}
      <div className="nav-center">
        <span className="nav-link" onClick={() => navigate("/about")}>
          ABOUT US
        </span>
        <span className="nav-link" onClick={() => navigate("/store-locator")}>
          STORE LOCATOR
        </span>
        <span className="nav-link" onClick={() => navigate("/contact")}>
          CONTACT US
        </span>
      </div>

      {/* Right: Icons */}
      <div className="nav-right">
        <FiHeart size={22} />

        <FiShoppingCart
          size={22}
          onClick={() => navigate("/cart")}
        />

        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="profile"
            className="profile-img"
            onClick={handleProfileClick}
          />
        ) : (
          <FiUser size={22} onClick={handleProfileClick} />
        )}
      </div>
    </div>
  );
}
