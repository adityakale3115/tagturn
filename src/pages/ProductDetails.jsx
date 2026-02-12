import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, limit, getDocs, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebaseConfig";
import { Minus, Plus, ShoppingCart, ArrowLeft, Loader2, Share2, Ruler, User } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [product, setProduct] = useState(null);
  const [shopName, setShopName] = useState("Official Store"); // State for vendor name
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 1;
        });
      }, 60);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchFullProductData = async () => {
      window.scrollTo(0, 0);
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          setActiveImage(productData.images?.[0] || "");
          
          // FETCH SHOP NAME from Vendors Collection
          if (productData.shop_id) {
            const vendorRef = doc(db, "vendors", productData.shop_id);
            const vendorSnap = await getDoc(vendorRef);
            if (vendorSnap.exists()) {
              setShopName(vendorSnap.data().shopName);
            }
          }

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
        }
      } catch (error) {
        toast.error("ERROR: ACCESS_DENIED_SYSTEM_TIMEOUT");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    if (id) fetchFullProductData();
  }, [id, navigate]);

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out the ${product.name} on TAGTURN`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("LINK_COPIED_TO_CLIPBOARD");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const addToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.info("IDENTITY_REQUIRED: Please login to update archive");
      return navigate("/login");
    }
    if (!selectedSize && product?.sizes?.length > 0) {
      return toast.error("SPECIFICATION_MISSING: Select a size");
    }

    setIsAdding(true);
    try {
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      const cartItem = {
        cartItemId: `${id}_${selectedSize}`,
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
          existingItems[existingItemIndex].quantity += quantity;
          await updateDoc(cartRef, { items: existingItems, lastUpdated: serverTimestamp() });
        } else {
          await updateDoc(cartRef, { items: arrayUnion(cartItem), lastUpdated: serverTimestamp() });
        }
      } else {
        await setDoc(cartRef, { userId: user.uid, userEmail: user.email, items: [cartItem], createdAt: serverTimestamp() });
      }
      toast.success(`${product.name} SYNCED TO ARCHIVE`);
    } catch (error) {
      toast.error("ENCRYPTION_ERROR: FAILED_TO_UPDATE_BAG");
    } finally {
      setIsAdding(false);
    }
  };

  const decreaseQty = () => quantity > 1 && setQuantity(prev => prev - 1);
  const increaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.info("STOCK_MAX_REACHED");
    }
  };

  if (loading) return (
    <div className="stealth-preloader">
      <div className="preloader-box">
        <span className="boot-tag">DECRYPTING_ARTICLE: {id?.slice(0, 8)}</span>
        <h2 className="boot-logo">TAGTURN</h2>
        <div className="boot-bar-bg"><div className="boot-bar-fill" style={{ width: `${percent}%` }}></div></div>
        <div className="boot-stats"><span>STATUS: INITIALIZING</span><span>{percent}%</span></div>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="stealth-page-wrapper">
      <Navbar />
      <div className="stealth-error">
        <h2>404 ARTICLE_NOT_FOUND</h2>
        <button className="neon-btn" onClick={() => navigate("/")}>RETURN_TO_ARCHIVE</button>
      </div>
    </div>
  );

  return (
    <div className="stealth-product-wrapper fade-in">
      <Navbar />
      <div className="product-main-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> <span>BACK_TO_COLLECTION</span>
        </button>

        <div className="product-layout-grid">
          <div className="media-column">
            <div className="main-display">
              {product.discount && <span className="discount-tag">-{product.discount}%</span>}
              <img src={activeImage} alt={product.name} className="hero-product-img" />
            </div>
            <div className="thumbnail-gallery">
              {product.images?.map((img, i) => (
                <div key={i} className={`thumb-item ${activeImage === img ? "selected" : ""}`} onClick={() => setActiveImage(img)}>
                  <img src={img} alt="preview" />
                </div>
              ))}
            </div>
          </div>

          <div className="info-column">
            <div className="brand-header">
              <div className="header-top-row">
                <span className="collection-label">TAGTURN - AUTHENTIC_WEAR</span>
                <button className="share-btn-stealth" onClick={handleShare} title="SHARE_ARTICLE">
                  <Share2 size={18} />
                </button>
              </div>
              <h1 className="product-name-title">{product.name}</h1>
              <div className="vendor-meta-group">
  <p className="vendor-meta">ARTICLE_ID: {id?.slice(0, 12)}</p>
  <p className="vendor-name-tag">
    SOURCE: 
    <span 
      className="shop-redirect-link" 
      onClick={() => navigate(`/shop/${product.shop_id}`)}
    >
      {shopName}
    </span>
  </p>
</div>
            </div>

            <div className="price-box">
              <span className="price-main">₹{product.price?.toLocaleString()}</span>
              {product.original_price && <span className="price-original">₹{product.original_price.toLocaleString()}</span>}
            </div>

            <div className="meta-spec-grid">
               {product.gender && (
                 <div className="meta-spec-item">
                    <User size={14} /> <span>{product.gender.toUpperCase()}</span>
                 </div>
               )}
               <div className={`stock-status ${product.stock < 5 ? "critical" : ""}`}>
                 {product.stock > 0 ? `[ ${product.stock} UNITS ]` : "ARCHIVED"}
               </div>
            </div>

            {/* Condition Meter */}
            {product.condition && (
              <div className="config-group">
                <p className="config-label">ARTICLE_CONDITION</p>
                <div className="condition-meter-container">
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: `${(product.condition / 10) * 100}%` }}></div>
                  </div>
                  <div className="meter-stats">
                    <span className="condition-value">{product.condition} / 10</span>
                    <span className="condition-desc">
                      {product.condition >= 9 ? "Pristine" : product.condition >= 7 ? "EXCELLENT" : product.condition >= 5 ? "GOOD" : "FAIR"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Measurements Section */}
            {(product.chest || product.length) && (
              <div className="config-group">
                <p className="config-label">TECH_MEASUREMENTS (INCHES)</p>
                <div className="measurement-grid">
                  {product.chest && (
                    <div className="measure-box">
                      <span className="m-label">CHEST</span>
                      <span className="m-value">{product.chest}"</span>
                    </div>
                  )}
                  {product.length && (
                    <div className="measure-box">
                      <span className="m-label">LENGTH</span>
                      <span className="m-value">{product.length}"</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="config-group">
              <p className="config-label">SIZE_SPECIFICATION</p>
              <div className="size-selector-grid">
                {product.sizes?.map(size => (
                  <button key={size} className={`size-square ${selectedSize === size ? "active" : ""}`} onClick={() => setSelectedSize(size)}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-group">
              <p className="config-label">QUANTITY_SELECT</p>
              <div className="stealth-counter">
                <button onClick={decreaseQty} disabled={product.stock === 0}><Minus size={14} /></button>
                <span className="qty-val">{quantity}</span>
                <button onClick={increaseQty} disabled={product.stock === 0}><Plus size={14} /></button>
              </div>
            </div>

            <div className="action-stack">
              <button className="bag-btn-dark" onClick={addToCart} disabled={product.stock === 0 || isAdding}>
                {isAdding ? <Loader2 className="animate-spin" size={16} /> : <ShoppingCart size={16} />} 
                {isAdding ? " UPDATING..." : " ADD TO ARCHIVE"}
              </button>
              <button className="checkout-btn-neon" onClick={async () => { await addToCart(); if (auth.currentUser) navigate("/cart"); }} disabled={product.stock === 0 || isAdding}>
                SECURE CHECKOUT
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-section">
            <h2 className="related-title">COMPLETE_THE_LOOK</h2>
            <div className="related-grid">
              {relatedProducts.map(item => (
                <div key={item.id} className="related-card" onClick={() => navigate(`/product/${item.id}`)}>
                   <img src={item.images?.[0]} alt={item.name} />
                   <div className="related-info"><p>{item.name}</p><span>₹{item.price}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}