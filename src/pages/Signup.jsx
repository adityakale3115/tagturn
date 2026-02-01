import Navbar from "../components/Navbar";
import "../styles/Auth.css";

export default function Signup() {
  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <div className="auth-container-stealth">
        <div className="auth-card-glass">
          <div className="auth-header">
            <span className="stealth-tag">NEW IDENTITY</span>
            <h2>JOIN THE ARCHIVE</h2>
            <p className="auth-subtitle">
              Establish your credentials to access exclusive drops.
            </p>
          </div>

          <div className="auth-form">
            <div className="input-group-stealth">
              <label>FULL NAME</label>
              <input
                placeholder="OPERATIVE NAME"
                autoComplete="off"
              />
            </div>

            <div className="input-group-stealth">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="identity@tagturn.com"
              />
            </div>

            <div className="input-group-stealth">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
              />
            </div>

            <button className="auth-btn-neon" disabled>
              CREATE IDENTITY
            </button>
          </div>

          <div className="auth-divider">
            <span className="divider-line"></span>
            <span className="divider-label">OR CONNECT VIA</span>
            <span className="divider-line"></span>
          </div>

          <button className="google-btn-stealth" disabled>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            GOOGLE AUTHENTICATION
          </button>

          <div className="auth-footer">
            <p>
              ALREADY HAVE AN IDENTITY?{" "}
              <span style={{ opacity: 0.6 }}>ACCESS PORTAL</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
