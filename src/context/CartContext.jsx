import { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // 🔄 Real-time listener for the User's Firestore Cart
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        const unsubscribeCart = onSnapshot(cartRef, (docSnap) => {
          if (docSnap.exists()) {
            setCartItems(docSnap.data().items || []);
          } else {
            setCartItems([]);
          }
          setLoading(false);
        });
        return () => unsubscribeCart();
      } else {
        setCartItems([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, [auth]);

  const addToCart = async (product, size, qty) => {
    const user = auth.currentUser;
    if (!user) return "AUTH_REQUIRED";

    const cartRef = doc(db, "carts", user.uid);
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: size,
      quantity: qty,
      addedAt: new Date().toISOString()
    };

    const cartSnap = await getDoc(cartRef);
    let updatedItems = [];

    if (cartSnap.exists()) {
      const existingItems = cartSnap.data().items || [];
      const itemIndex = existingItems.findIndex(i => i.id === product.id && i.size === size);

      if (itemIndex > -1) {
        existingItems[itemIndex].quantity += qty;
        updatedItems = [...existingItems];
      } else {
        updatedItems = [...existingItems, newItem];
      }
      await updateDoc(cartRef, { items: updatedItems, lastUpdated: serverTimestamp() });
    } else {
      await setDoc(cartRef, { items: [newItem], userId: user.uid, createdAt: serverTimestamp() });
    }
    return "SUCCESS";
  };

  const removeFromCart = async (productId, size) => {
    const user = auth.currentUser;
    const cartRef = doc(db, "carts", user.uid);
    const updatedItems = cartItems.filter(item => !(item.id === productId && item.size === size));
    await updateDoc(cartRef, { items: updatedItems });
  };

  const updateQuantity = async (productId, size, change) => {
    const user = auth.currentUser;
    const cartRef = doc(db, "carts", user.uid);
    const updatedItems = cartItems.map(item => {
      if (item.id === productId && item.size === size) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    });
    await updateDoc(cartRef, { items: updatedItems });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, removeFromCart, updateQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);