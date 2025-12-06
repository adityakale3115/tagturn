import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc } from "firebase/firestore";
import "../styles/ProductDetails.css";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import useAuthListener from "../hooks/useAuthListener";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthListener();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");

  const [loading, setLoading] = useState(true);


  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setProduct({ id: snap.id, ...data });
          setActiveImage(data.images?.[0] || "");
          fetchRelatedProducts(data.category, snap.id);
        } else {
          setProduct(null);
        }

      } catch (err) {
        console.error("Error loading product:", err);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);


  // Fetch related products
  const fetchRelatedProducts = async (category, productId) => {
    const q = query(collection(db, "products"), where("category", "==", category));
    const snap = await getDocs(q);

    const filtered = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.id !== productId);

    setRelatedProducts(filtered);
  };


  // ⭐ ADD TO CART FUNCTION
  const addToCart = async () => {
    if (!user) {
      toast.warning("Please login first");
      return navigate("/login");
    }

    if (!selectedSize && product.sizes?.length > 0) {
      return toast.error("Please select a size");
    }

    try {
      const cartRef = doc(db, "users", user.uid, "cart", product.id);

      const itemData = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        size: selectedSize || null,
        quantity,
        addedAt: new Date()
      };

      // If product already in cart → increase qty instead of replace
      const existing = await getDoc(cartRef);

      if (existing.exists()) {
        await updateDoc(cartRef, {
          quantity: existing.data().quantity + quantity
        });
      } else {
        await setDoc(cartRef, itemData);
      }

      toast.success("Added to cart!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };


  // UI / States
  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;
  if (!product) return <div className="product-not-found">Product Not Found</div>;

  const decreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQty = () => quantity < product.stock && setQuantity(quantity + 1);


  return (
    <>
      <div className="product-page">

        {/* LEFT SECTION */}
        <div className="left">
          <img src={activeImage} className="big-image" alt={product.name} />

          <div className="thumbnail-row">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`thumbnail ${activeImage === img ? "active-thumb" : ""}`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="right">
          <h3 className="brand">THE TAGTURN STORE</h3>
          <h1>{product.name}</h1>

          <h2 className="price">₹{product.price}</h2>
          <p className="stock">🟢 {product.stock} items available</p>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div className="size-box">
              <p className="label">Select Size</p>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="qty-box">
            <p className="label">Quantity</p>
            <div className="qty-control">
              <button onClick={decreaseQty}>−</button>
              <span>{quantity}</span>
              <button onClick={increaseQty}>+</button>
            </div>
          </div>

          {/* BUTTONS */}
          <button className="add-cart-btn" onClick={addToCart}>Add to Cart</button>
          <button className="buy-btn" onClick={() => { addToCart(); navigate("/cart"); }}>BUY NOW</button>

        </div>
      </div>


      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2>Similar {product.category}</h2>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="related-card"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img src={item.images?.[0]} alt="" />
                <p>{item.name}</p>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
