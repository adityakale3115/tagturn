import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import CategoryProducts from "./pages/CategoryProducts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";

// Auth hook
import useAuthListener from "./hooks/useAuthListener";


// -------- Protected Route (Only logged-in users can enter) --------
function ProtectedRoute({ children }) {
  const user = useAuthListener();

  // Firebase still checking auth status
  if (user === null) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Checking authentication...</p>;
  }

  // No user means not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// -------- Redirect Logged-in Users away from Login/Signup --------
function AuthRedirect({ children }) {
  const user = useAuthListener();

  // If logged in → redirect to home
  if (user) return <Navigate to="/" replace />;

  return children;
}


// -------- Scroll To Top on page change --------
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}


// -------- APP COMPONENT --------
export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />

        <Routes>

          {/* -------- Public Routes -------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:categoryName" element={<CategoryProducts />} />

          {/* -------- Auth Routes (Blocked if logged-in) -------- */}
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />

          {/* -------- Protected Routes -------- */}
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

        </Routes>
      </Router>

      {/* Toast Notification */}
      <ToastContainer position="top-center" autoClose={1800} />
    </>
  );
}
