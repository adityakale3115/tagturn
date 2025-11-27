import { useState } from "react";
import { registerUser, googleLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSignup = async () => {
    try {
      await registerUser(form.email, form.password, form.name);
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
      <h2>Create Account</h2>

      <input
        className="auth-input"
        placeholder="Full Name"
        name="name"
        onChange={handleChange}
      />

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

      <button className="auth-btn" onClick={handleSignup}>
        Sign Up
      </button>

      <button className="google-btn" onClick={handleGoogle}>
        <img src="https://www.svgrepo.com/show/355037/google.svg" alt="google" />
        Continue with Google
      </button>

      <p className="switch-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </div>
  );
}
