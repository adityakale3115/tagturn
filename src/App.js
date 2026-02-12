import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

// --- Page Imports ---
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import SearchPage from "./components/SearchPage";
import ShopPage from "./pages/ShopPage"; // 👈 Add this import
import AllShops from "./pages/AllShops"; // 👈 Import new page

// --- UI Effects ---
import CustomCursor from "./components/CustomCursor";
import StealthParticles from "./components/StealthParticles";

/**
 * Global Scroll Reset Logic
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    // 🟢 MOVE CartProvider HERE to wrap the entire application
    <CartProvider> 
      <CustomCursor />
      <StealthParticles />

      <Router>
        <ScrollToTop />

        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/vendors" element={<AllShops />} />

          {/* --- PRODUCT ROUTES --- */}
          <Route path="/category/:categoryName" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/shop/:shopId" element={<ShopPage />} /> {/* 👈 Add this route */}

          {/* --- STATIC USER PAGES --- */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />

          {/* --- FALLBACK --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        newestOnTop
        theme="dark"
      />
    </CartProvider>
  );
}