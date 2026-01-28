import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "../styles/ProductDetails.css";

const MOCK_PRODUCTS = [
  { id: 1, name: "Premium Oversized Tee", category: "Men", price: 1299, original_price: 1899, discount: 30, sizes: ["M", "L", "XL"], stock: 10, images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800"] },
  { id: 2, name: "Classic Linen Shirt", category: "Men", price: 2499, original_price: 3500, discount: 25, sizes: ["S", "M", "L"], stock: 5, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800"] },
  { id: 3, name: "Straight Fit Chinos", category: "Men", price: 1899, original_price: 2200, discount: 15, sizes: ["L", "XL", "XXL"], stock: 8, images: ["https://images.unsplash.com/photo-1473966968600-fa804b86829b?q=80&w=800"] },
  { id: 4, name: "Urban Utility Jacket", category: "Men", price: 3499, original_price: 4999, discount: 40, sizes: ["XL", "XXL"], stock: 3, images: ["https://images.unsplash.com/photo-1591047134402-23bbdddf4874?q=80&w=800"] },
  { id: 5, name: "Minimalist Hoodie", category: "Men", price: 2199, original_price: 2999, discount: 20, sizes: ["M", "L"], stock: 12, images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800"] },
  { id: 6, name: "Graphic Cotton Tee", category: "Men", price: 999, original_price: 1499, discount: 33, sizes: ["S", "M"], stock: 0, images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800"] },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const foundProduct = MOCK_PRODUCTS.find((p) => p.id === Number(id));

    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.images[0]);
      const related = MOCK_PRODUCTS.filter(
        (p) => p.category === foundProduct.category && p.id !== foundProduct.id
      ).slice(0, 4);
      setRelatedProducts(related);
    }
    setLoading(false);
  }, [id]);

  const addToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      return toast.error("Please select a size");
    }
    toast.success(`${product.name} (${selectedSize}) added to bag`);
  };

  const decreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQty = () => quantity < product.stock ? setQuantity(quantity + 1) : toast.info("Stock limit reached");

  if (loading) return <div className="stealth-loader">INITIALIZING...</div>;
  if (!product) return <div className="stealth-error">ARTICLE NOT FOUND</div>;

  return (
    <div className="stealth-product-wrapper">
      <Navbar />
      <div className="product-main-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> // BACK TO ARCHIVE
        </button>

        <div className="product-layout-grid">
          {/* LEFT: MEDIA SECTION */}
          <div className="media-column">
            <div className="main-display">
              {product.discount && <span className="discount-tag">-{product.discount}%</span>}
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

          {/* RIGHT: CONFIGURATION SECTION */}
          <div className="info-column">
            <div className="brand-header">
              <span className="collection-label">TAGTURN // ARCHIVE 2026</span>
              <h1 className="product-name-title">{product.name}</h1>
            </div>

            <div className="price-box">
              <span className="price-main">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <span className="price-original">₹{product.original_price.toLocaleString()}</span>
              )}
            </div>

            <div className={`stock-status ${product.stock < 5 ? 'critical' : ''}`}>
              {product.stock > 0 ? `AVAILABLE: [ ${product.stock} UNITS ]` : "STATUS: ARCHIVED / OUT OF STOCK"}
            </div>

            <div className="config-group">
              <p className="config-label">SELECT SIZE</p>
              <div className="size-selector-grid">
                {product.sizes?.map((size) => (
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
                <button onClick={decreaseQty} disabled={product.stock === 0}><Minus size={14}/></button>
                <span className="qty-val">{quantity}</span>
                <button onClick={increaseQty} disabled={product.stock === 0}><Plus size={14}/></button>
              </div>
            </div>

            <div className="action-stack">
              <button 
                className="bag-btn-dark" 
                onClick={addToCart} 
                disabled={product.stock === 0}
              >
                <ShoppingCart size={16} /> ADD TO BAG
              </button>
              <button 
                className="checkout-btn-neon" 
                onClick={() => { addToCart(); navigate("/cart"); }}
                disabled={product.stock === 0}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>

        {/* RELATED SECTION */}
        {relatedProducts.length > 0 && (
          <div className="archive-related">
            <div className="neon-line"></div>
            <h2 className="related-title">Complete the look</h2>
            <div className="related-grid-stealth">
              {relatedProducts.map((item) => (
                <div key={item.id} className="related-article" onClick={() => navigate(`/product/${item.id}`)}>
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