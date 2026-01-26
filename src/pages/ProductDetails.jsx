import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar"; // Ensure path is correct
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
    } else {
      setProduct(null);
    }
    
    setLoading(false);
  }, [id]);

  const addToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      return toast.error("Please select a size");
    }
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const decreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.info("No more stock available");
    }
  };

  if (loading) return <div className="loading-state">Loading Product...</div>;
  if (!product) return <div className="error-state">Product Not Found</div>;

  return (
    <>
      <Navbar />
      <div className="product-page-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Collection
        </button>

        <div className="product-page">
          {/* LEFT: IMAGES */}
          <div className="left">
            <div className="main-image-container">
              <img src={activeImage} className="big-image" alt={product.name} />
            </div>
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

          {/* RIGHT: INFO */}
          <div className="right">
            <h3 className="brand">THE TAGTURN STORE</h3>
            <h1>{product.name}</h1>
            <div className="price-tag">
              <h2 className="price">₹{product.price.toLocaleString()}</h2>
              {product.original_price && (
                <span className="old-price">₹{product.original_price.toLocaleString()}</span>
              )}
            </div>
            
            <p className="stock">
              {product.stock > 0 ? `🟢 ${product.stock} items available` : "🔴 Out of stock"}
            </p>

            {/* Size selection */}
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

            {/* Quantity control */}
            <div className="qty-box">
              <p className="label">Quantity</p>
              <div className="qty-control">
                <button onClick={decreaseQty} disabled={product.stock === 0}><Minus size={14}/></button>
                <span>{quantity}</span>
                <button onClick={increaseQty} disabled={product.stock === 0}><Plus size={14}/></button>
              </div>
            </div>

            <div className="action-btns">
              <button 
                  className="add-cart-btn" 
                  onClick={addToCart} 
                  disabled={product.stock === 0}
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button 
                className="buy-btn" 
                onClick={() => { addToCart(); navigate("/cart"); }}
                disabled={product.stock === 0}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <div className="section-divider"></div>
            <h2>You May Also Like</h2>
            <div className="related-grid">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="related-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="related-img-wrapper">
                    <img src={item.images?.[0]} alt={item.name} />
                  </div>
                  <div className="related-info">
                    <p className="related-name">{item.name}</p>
                    <span className="related-price">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}