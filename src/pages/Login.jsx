import { useState } from "react";
import { loginUser, googleLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleLogin = async () => {
    try {
      await loginUser(form.email, form.password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>

      <input
        className="auth-input"
        placeholder="Email Address"
        name="email"
        onChange={handleChange}
      />

      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        name="password"
        onChange={handleChange}
      />

      <button className="auth-btn" onClick={handleLogin}>
        Login
      </button>

      <button className="google-btn" onClick={handleGoogle}>
        <img src="https://www.svgrepo.com/show/355037/google.svg" alt="google" />
        Continue with Google
      </button>

      <p className="switch-text">
        New user?{" "}
        <span onClick={() => navigate("/signup")}>Create Account</span>
      </p>
    </div>
  );
}
