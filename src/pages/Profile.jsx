import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Phone, Trash2, LogOut, Shield } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";

// 1. Firebase Imports
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 2. Fetch User Data on Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          // If no doc exists, pre-fill email from Auth
          setFormData((prev) => ({ ...prev, email: user.email }));
        }
        setLoading(false);
      } else {
        navigate("/login"); // Redirect if session expires
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  // 3. Save/Update Logic
  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setSaving(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      // setDoc with { merge: true } creates the doc if it doesn't exist
      await setDoc(userRef, formData, { merge: true });
      
      alert("LOCAL ARCHIVE UPDATED");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("FAILED TO UPDATE ARCHIVE");
    } finally {
      setSaving(false);
    }
  };

  // 4. Logout Logic
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (loading) return <div className="loading-screen">SYNCING WITH ARCHIVE...</div>;

  return (
    <div className="profile-theme-wrapper">
      <Navbar />
      
      <div className="profile-container">
        {/* --- SIDEBAR --- */}
        <aside className="profile-sidebar">
          <div className="profile-id-card">
            <div className="id-avatar">
              <Shield size={40} className="accent-icon" />
            </div>
            <span className="stealth-tag">// AUTHENTICATED</span>
            <h2 className="user-full-name">{formData.firstName || "OPERATIVE"} {formData.lastName || "N/A"}</h2>
            <p className="user-email-static">{formData.email}</p>
          </div>

          <nav className="profile-nav">
            <button className="nav-item active">ARCHIVE PROFILE</button>
            <button className="nav-item">ORDER HISTORY</button>
            <button className="nav-item">SECURITY</button>
          </nav>

          <div className="sidebar-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> TERMINATE SESSION
            </button>
            <button className="delete-btn">
              <Trash2 size={16} /> SCRUB IDENTITY
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="profile-content">
          <header className="content-header">
            <h1 className="content-title">EDIT IDENTITY</h1>
            <p className="content-subtitle">Modify your archive credentials.</p>
          </header>

          <div className="stealth-form">
            <div className="form-row">
              <div className="input-group">
                <label>FIRST NAME</label>
                <input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="input-group">
                <label>LAST NAME</label>
                <input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="input-group">
              <label>MOBILE CONTACT</label>
              <div className="input-with-icon">
                <Phone size={14} />
                <input
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label>SHIPPING COORDINATES</label>
              <div className="input-with-icon">
                <MapPin size={14} />
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <button className="save-btn-stealth" onClick={handleSave} disabled={saving}>
              {saving ? "UPLOADING..." : "COMMIT CHANGES"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}