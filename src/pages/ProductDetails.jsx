import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, limit, getDocs, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { db } from "../firebase/firebaseConfig";
import { Minus, Plus, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Auth

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false); // Loading state for button

  useEffect(() => {
    const fetchFullProductData = async () => {
      window.scrollTo(0, 0);
      setLoading(true);

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          setActiveImage(productData.images?.[0] || "");
          
          const relatedQuery = query(
            collection(db, "products"),
            where("category", "==", productData.category),
            limit(5)
          );
          
          const relatedSnap = await getDocs(relatedQuery);
          const relatedList = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(item => item.id !== id)
            .slice(0, 4);
          
          setRelatedProducts(relatedList);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Firestore Fetch Error:", error);
        toast.error("ERROR: FAILED_TO_RETRIEVE_ARTICLE");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullProductData();
  }, [id]);

  /* ================= FIRESTORE CART LOGIC ================= */
  const addToCart = async () => {
    const user = auth.currentUser;

    // 1️⃣ Check if user is logged in
    if (!user) {
      toast.info("Please login to add items to your bag");
      return navigate("/login");
    }

    // 2️⃣ Check if size is selected
    if (!selectedSize && product.sizes?.length > 0) {
      return toast.error("Please select a size");
    }

    setIsAdding(true);

    try {
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);

      const cartItem = {
        cartItemId: `${id}_${selectedSize}`, // Unique ID for this specific variation
        id: id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        quantity: quantity,
        addedAt: new Date().toISOString()
      };

      if (cartSnap.exists()) {
        const existingItems = cartSnap.data().items || [];
        const existingItemIndex = existingItems.findIndex(item => item.cartItemId === cartItem.cartItemId);

        if (existingItemIndex > -1) {
          // If item exists, update quantity
          existingItems[existingItemIndex].quantity += quantity;
          await updateDoc(cartRef, {
            items: existingItems,
            lastUpdated: serverTimestamp()
          });
        } else {
          // If item is new, add to array
          await updateDoc(cartRef, {
            items: arrayUnion(cartItem),
            lastUpdated: serverTimestamp()
          });
        }
      } else {
        // Create new cart document
        await setDoc(cartRef, {
          userId: user.uid,
          userEmail: user.email,
          items: [cartItem],
          createdAt: serverTimestamp()
        });
      }

      toast.success(`${product.name} added to bag`);
    } catch (error) {
      console.error("Cart Error:", error);
      toast.error("FAILED_TO_UPDATE_BAG");
    } finally {
      setIsAdding(false);
    }
  };

  const decreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQty = () =>
    quantity < product.stock
      ? setQuantity(quantity + 1)
      : toast.info("Stock limit reached");

  if (loading) return (
    <div className="stealth-loader-container">
       <Loader2 className="spinner-neon" size={40} />
       <p>DECRYPTING_ARTICLE_DATA...</p>
    </div>
  );
  
  if (!product) return (
    <div className="stealth-page-wrapper">
      <Navbar />
      <div className="stealth-error">
        <h2>404 // ARTICLE_NOT_FOUND</h2>
        <button onClick={() => navigate("/")}>RETURN_TO_ARCHIVE</button>
      </div>
    </div>
  );

  return (
    <div className="stealth-product-wrapper">
      <Navbar />

      <div className="product-main-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} />
          <span>BACK TO ARCHIVE</span>
        </button>

        <div className="product-layout-grid">
          <div className="media-column">
            <div className="main-display">
              {product.discount && (
                <span className="discount-tag">-{product.discount}%</span>
              )}
              <img src={activeImage} alt={product.name} className="hero-product-img" />
            </div>

            <div className="thumbnail-gallery">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  className={`thumb-item ${activeImage === img ? "selected" : ""}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt="preview" />
                </div>
              ))}
            </div>
          </div>

          <div className="info-column">
            <div className="brand-header">
              <span className="collection-label">TAGTURN // AUTHENTIC_WEAR</span>
              <h1 className="product-name-title">{product.name}</h1>
              <p className="vendor-meta">STORE_ID: {product.shop_id?.slice(0,8)}</p>
            </div>

            <div className="price-box">
              <span className="price-main">₹{product.price?.toLocaleString()}</span>
              {product.original_price && (
                <span className="price-original">
                  ₹{product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            <div className={`stock-status ${product.stock < 5 ? "critical" : ""}`}>
              {product.stock > 0
                ? `AVAILABLE: [ ${product.stock} UNITS ]`
                : "STATUS: ARCHIVED / OUT OF STOCK"}
            </div>

            <div className="config-group">
              <p className="config-label">SELECT SIZE</p>
              <div className="size-selector-grid">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    className={`size-square ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-group">
              <p className="config-label">QUANTITY</p>
              <div className="stealth-counter">
                <button onClick={decreaseQty} disabled={product.stock === 0}>
                  <Minus size={14} />
                </button>
                <span className="qty-val">{quantity}</span>
                <button onClick={increaseQty} disabled={product.stock === 0}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="action-stack">
              <button
                className="bag-btn-dark"
                onClick={addToCart}
                disabled={product.stock === 0 || isAdding}
              >
                {isAdding ? <Loader2 className="animate-spin" size={16} /> : <ShoppingCart size={16} />} 
                {isAdding ? " UPDATING..." : " ADD TO BAG"}
              </button>

              <button
                className="checkout-btn-neon"
                onClick={async () => {
                  await addToCart();
                  if (auth.currentUser) navigate("/cart");
                }}
                disabled={product.stock === 0 || isAdding}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="archive-related">
            <div className="neon-line"></div>
            <h2 className="related-title">Complete the look</h2>

            <div className="related-grid-stealth">
              {relatedProducts.map(item => (
                <div
                  key={item.id}
                  className="related-article"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="article-img">
                    <img src={item.images?.[0]} alt={item.name} />
                  </div>
                  <div className="article-meta">
                    <p>{item.name}</p>
                    <span>₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}