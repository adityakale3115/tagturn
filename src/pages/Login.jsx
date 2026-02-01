import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile"); 
    } catch (err) {
      setError("INVALID CREDENTIALS. ACCESS DENIED.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/profile");
    } catch (err) {
      setError("GOOGLE AUTHENTICATION FAILED.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <div className="auth-container-stealth">
        <div className="auth-card-glass">
          <div className="auth-header">
            <span className="stealth-tag"> ACCESS PORTAL</span>
            <h2>IDENTIFY YOURSELF</h2>
            <p className="auth-subtitle">
              Enter the archive to manage your collection.
            </p>
          </div>

          {/* Error Message Display */}
          {error && <div className="auth-error-msg">{error}</div>}

          <form className="auth-form" onSubmit={handleEmailLogin}>
            <div className="input-group-stealth">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="identity@tagturn.com"
                autoComplete="off"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group-stealth">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="auth-btn-neon" 
              disabled={loading}
            >
              {loading ? "VERIFYING..." : "VERIFY IDENTITY"}
            </button>
          </form>

          <div className="auth-divider">
            <span className="divider-line"></span>
            <span className="divider-label">OR CONNECT VIA</span>
            <span className="divider-line"></span>
          </div>

          <button 
            className="google-btn-stealth" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            GOOGLE AUTHENTICATION
          </button>

          <div className="auth-footer">
            <p>
              NEW TO THE ARCHIVE? <Link to="/signup">CREATE IDENTITY</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}