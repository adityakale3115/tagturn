import { auth } from "../firebase/firebaseConfig";
import "../styles/Auth.css";

export default function Profile() {
  const user = auth.currentUser;

  if (!user) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Not Logged In</h2>;

  return (
    <div className="auth-container" style={{ textAlign: "center" }}>
      <h2>Your Profile</h2>

      <img 
        src={user.photoURL || "https://via.placeholder.com/120"} 
        alt="profile" 
        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "15px" }}
      />

      <p><b>Name:</b> {user.displayName || "Not Set"}</p>
      <p><b>Email:</b> {user.email}</p>

      <button 
        className="auth-btn" 
        onClick={() => {
          auth.signOut();
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}
