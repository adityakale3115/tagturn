import { useState, useEffect } from "react";
import { loginUser, googleLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthListener from "../hooks/useAuthListener";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthListener();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
    } catch {
      toast.error("Google login failed");
    }
  };

  if (authLoading) return null;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Authenticating..." : "Login"}
        </button>

        <div className="divider-text">OR</div>

        <button onClick={handleGoogle}>Continue with Google</button>
      </div>
    </div>
  );
}
