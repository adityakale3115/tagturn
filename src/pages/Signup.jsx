import { useState, useEffect } from "react";
import { registerUser, googleLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthListener from "../hooks/useAuthListener";
import "../styles/Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthListener();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (!authLoading && user) navigate("/");
  }, [user, authLoading, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password)
      return toast.error("Please fill all fields");

    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await registerUser(email, password, name);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
    } catch {
      toast.error("Google signup failed");
    }
  };

  if (authLoading) return null;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <div className="divider-text">OR</div>
        <button onClick={handleGoogle}>Continue with Google</button>
      </div>
    </div>
  );
}
