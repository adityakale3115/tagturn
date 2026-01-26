import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient"; // Updated to Supabase
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthListener from "../hooks/useAuthListener";
import "../styles/Cart.css";

export default function Cart() {
  const user = useAuthListener();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH CART ITEMS ---------------- */
  /* ---------------- FETCH CART ITEMS ---------------- */
const fetchCart = async () => {
  const userId = user?.id || user?.uid;
  if (!userId) return;

  // DEBUG: Uncomment this to see exactly what ID is being queried
  // console.log("Fetching cart for ID:", userId);

  try {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId) // This will now match the TEXT column perfectly
      .order("created_at", { ascending: false });

    if (error) throw error;
    setCartItems(data || []);
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    toast.error("Failed to load cart");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Small delay to check if user is truly logged out
      const timer = setTimeout(() => {
        if (!user) {
          toast.info("Please login to view cart");
          navigate("/login");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  /* ---------------- UPDATE QUANTITY ---------------- */
  const updateQuantity = async (item, change) => {
    const newQty = item.quantity + change;
    if (newQty < 1) return toast.warning("Minimum quantity is 1");

    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity: newQty })
        .eq("id", item.id);

      if (error) throw error;
      
      // Update local state for instant UI feedback
      setCartItems(prev => 
        prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
      );
    } catch (err) {
      toast.error("Update failed");
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast.success("Item removed");
      setCartItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  /* ---------------- CALCULATE TOTAL ---------------- */
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <p className="cart-loading">Loading your cart...</p>;

  if (cartItems.length === 0)
    return (
      <div className="cart-empty">
        <h2>🛒 Your Cart is Empty</h2>
        <button className="explore-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Your Cart</h1>

      <div className="cart-content">
        {/* CART ITEMS LIST */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-card">
              <img className="cart-img" src={item.image} alt={item.name} />

              <div className="cart-info">
                <h3>{item.name}</h3>
                {item.size && <p>Size: <b>{item.size}</b></p>}
                <p className="price">₹ {item.price}</p>

                <div className="qty-buttons">
                  <button onClick={() => updateQuantity(item, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, +1)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY BOX */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items:</span>
            <b>{cartItems.length}</b>
          </div>
          <div className="summary-row">
            <span>Total Amount:</span>
            <b>₹ {totalPrice.toLocaleString()}</b>
          </div>
          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}