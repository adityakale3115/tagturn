import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { auth } from "../firebase/firebaseConfig";

export default function Cart() {
  const user = useAuthListener();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Wait for auth to fully load
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        toast.warning("Please Login to View Cart");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
      setChecked(true);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!checked) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Checking login...
      </p>
    );
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🛒 Your Cart</h1>
      <p>Your cart is currently empty.</p>
    </div>
  );
}
