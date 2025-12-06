import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { useEffect } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthListener();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // prevents flashing redirect

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Profile</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
