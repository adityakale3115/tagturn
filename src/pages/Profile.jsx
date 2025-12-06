import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut, deleteUser } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import useAuthListener from "../hooks/useAuthListener";
import { toast } from "react-toastify";
import "../styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthListener();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [loadingSave, setLoadingSave] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobile: "",
    address: ""
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setFormData(snap.data());
        }
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(() => {
      setCheckingAuth(false);
      if (!user) navigate("/login");
      else loadProfile();
    }, 500);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (checkingAuth) {
    return (
      <div className="loading-container">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Save profile to Firestore
  const handleSave = async () => {
    if (!formData.mobile) {
      return toast.error("Mobile number is required");
    }

    setLoadingSave(true);
    try {
      await setDoc(doc(db, "users", user.uid), formData, { merge: true });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to save profile");
    }
    setLoadingSave(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Delete account & Firestore record
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(auth.currentUser);

      toast.success("Account deleted successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete account. Login recently required.");
    }
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="user-card">
          <h2 className="user-name">{formData.firstName} {formData.lastName}</h2>
          <p className="user-email">{user?.email}</p>
          <a className="membership-link" href="#">Get Membership Now</a>
        </div>

        <nav className="profile-nav">
          <div className="nav-item">Orders</div>
          <div className="nav-item">Gift Vouchers</div>
          <div className="nav-item">TSS Points <span className="nav-badge">0</span></div>
          <div className="nav-item">TSS Money <span className="nav-badge">₹0</span></div>
          <div className="nav-item">FAQs</div>
          <div className="nav-item active">Profile</div>
        </nav>

        <div className="action-buttons">
          <button className="action-btn delete" onClick={handleDeleteAccount}>Delete My Account</button>
          <button className="action-btn logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
        <h1>Edit Profile</h1>

        <div className="form-section">
          <label>Email</label>
          <input className="form-input" value={user?.email} disabled />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">First Name</label>
            <input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              placeholder="DD/MM/YYYY"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Last Name</label>
            <input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="required">Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>
        </div>

        <label>Gender</label>
        <div className="gender-options">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g}>
              <input
                type="radio"
                value={g}
                checked={formData.gender === g}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
              {g}
            </label>
          ))}
        </div>

        {/* Address */}
        <label style={{ marginTop: 20 }}>Address</label>
        <textarea
          className="form-textarea"
          placeholder="Enter your delivery address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <button className="save-btn" onClick={handleSave} disabled={loadingSave}>
          {loadingSave ? "Saving..." : "Save Changes"}
        </button>
      </main>
    </div>
  );
}
