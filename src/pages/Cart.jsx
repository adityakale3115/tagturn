import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuthListener from "../hooks/useAuthListener";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import "../styles/Cart.css";

export default function Cart() {
  const user = useAuthListener();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen to cart items LIVE
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        toast.info("Please login to view cart");
        navigate("/login");
      } else {
        const cartRef = collection(db, "users", firebaseUser.uid, "cart");

        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setCartItems(items);
          setLoading(false);
        });

        return () => unsubscribeCart();
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Update Quantity
  const updateQuantity = async (item, change) => {
    const newQty = item.quantity + change;
    if (newQty < 1) return toast.warning("Minimum quantity is 1");

    await updateDoc(doc(db, "users", user.uid, "cart", item.id), {
      quantity: newQty,
    });
  };

  // Remove item
  const removeItem = async (itemId) => {
    await deleteDoc(doc(db, "users", user.uid, "cart", itemId));
    toast.success("Item removed");
  };

  // Total Price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  // UI Loading / Empty states
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
