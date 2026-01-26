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

// Page Imports
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import AuthCallback from "./pages/AuthCallback";

// Category & Product Pages
import CategoryProducts from "./pages/CategoryProducts"; 
import ProductDetails from "./pages/ProductDetails"; // Now active

import useAuthListener from "./hooks/useAuthListener";

/**
 * Ensures only logged-in users can access specific pages.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthListener();
  if (loading) return <p className="loading-state">Checking authentication...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Forces the window to scroll to top whenever the URL path changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* --- SHOPPING FLOW --- */}
          {/* Shows products by category: e.g., /category/Men */}
          <Route path="/category/:categoryName" element={<CategoryProducts />} />
          
          {/* Shows specific product details: e.g., /product/1 */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* --- CATCH-ALL ROUTE --- */}
          {/* Redirects any unknown URL back to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Global Notification System */}
      <ToastContainer 
        position="bottom-right" // Changed to bottom-right for better UX on mobile
        autoClose={2000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}