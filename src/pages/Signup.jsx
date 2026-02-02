import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; 
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "../styles/Auth.css";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [userOtp, setUserOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();

  // --- EMAILJS CONFIGURATION ---
  const SERVICE_ID = "service_gcu9waz"; // Your Service ID
  const TEMPLATE_ID = "template_o0ze6er"; // Get this from EmailJS Templates tab
  const PUBLIC_KEY = "Cx5GHvoYAF9hoGoQY";   // Get this from EmailJS Account settings

  const handleSendOtp = async () => {
    const email = formData.email.toLowerCase();
    
    // Domain Verification
    if (!email.endsWith("@gmail.com") && !email.endsWith("@vit.edu")) {
      return toast.error("ACCESS DENIED: Use @vit.edu or @gmail.com credentials.");
    }

    if (!formData.name || !formData.password) {
      return toast.error("Please complete all identity fields.");
    }

    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      otp_code: code,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      toast.info("Verification code dispatched to your inbox.");
      setOtpSent(true);
    } catch (error) {
      toast.error("Security transmission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeSignup = async () => {
    if (userOtp !== generatedOtp) {
      return toast.error("Invalid clearance code.");
    }

    setLoading(true);
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Create User Profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      toast.success("Identity established. Welcome to the Archive.");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
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
            <span className="stealth-tag">SECURITY CLEARANCE</span>
            <h2>{otpSent ? "ENTER CODE" : "JOIN THE ARCHIVE"}</h2>
          </div>

          {!otpSent ? (
            <div className="auth-form">
              <div className="input-group-stealth">
                <label>OPERATIVE NAME</label>
                <input onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="FULL NAME" />
              </div>
              <div className="input-group-stealth">
                <label>EMAIL ADDRESS (@VIT.EDU / @GMAIL)</label>
                <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="identity@vit.edu" />
              </div>
              <div className="input-group-stealth">
                <label>PASSWORD</label>
                <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
              </div>
              <button className="auth-btn-neon" onClick={handleSendOtp} disabled={loading}>
                {loading ? "TRANSMITTING..." : "REQUEST ACCESS CODE"}
              </button>
            </div>
          ) : (
            <div className="auth-form">
              <div className="input-group-stealth">
                <label>6-DIGIT VERIFICATION CODE</label>
                <input 
                  placeholder="000000" 
                  maxLength="6" 
                  style={{ textAlign: 'center', letterSpacing: '10px', fontSize: '1.5rem' }}
                  onChange={(e) => setUserOtp(e.target.value)} 
                />
              </div>
              <button className="auth-btn-neon" onClick={handleFinalizeSignup} disabled={loading}>
                {loading ? "AUTHENTICATING..." : "VERIFY & SIGNUP"}
              </button>
              <p className="resend-link" onClick={() => setOtpSent(false)} style={{cursor: 'pointer', textAlign: 'center', marginTop: '15px', fontSize: '0.8rem', opacity: 0.6}}>
                BACK TO DETAILS
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}