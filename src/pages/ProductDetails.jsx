import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import products from "../data/products";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id == id);

  // Hooks must be here (NOT after conditional return)
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(product ? product.images[0] : "");

  // If product not found → return after hooks
  if (!product) {
    return <div className="product-not-found">Product Not Found</div>;
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDesc,
        url: window.location.href
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <>
      <div className="product-page">
        
        {/* LEFT SIDE IMAGE + THUMBNAILS */}
        <div className="left">
          <img src={activeImage} className="big-image" alt={product.name} />

          <div className="thumbnail-row">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                className={`thumbnail ${activeImage === img ? "active-thumb" : ""}`}
                onClick={() => setActiveImage(img)}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="right">
          <h3 className="brand">THE TAGTURN STORE</h3>
          <h1>{product.name}</h1>

          <p className="sold-by">Sold By: <b>{product.seller}</b></p>

          <h2 className="price">₹{product.price.toLocaleString()}</h2>

          <p className="stock">🟢 {product.stock} items left in stock</p>

          {/* SIZE OPTIONS */}
          {product.sizes && (
            <div className="size-box">
              <p className="label">Available Sizes</p>
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

          {/* QUANTITY */}
          <div className="qty-box">
            <p className="label">Quantity</p>
            <div className="qty-control">
              <button onClick={decreaseQty}>−</button>
              <span>{quantity}</span>
              <button onClick={increaseQty}>+</button>
            </div>
          </div>

          <button className="add-cart-btn">Add to Cart</button>
          <button className="buy-btn">BUY NOW</button>

          <p className="short-desc">{product.shortDesc}</p>

          <button className="share-btn" onClick={handleShare}>📤 Share</button>

          <div className="details">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
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
                <img src={item.images[0]} alt="" />
                <p>{item.name}</p>
                <span>₹{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
