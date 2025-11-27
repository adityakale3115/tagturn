import "./../styles/FeaturedProducts.css";
import products from "../data/products";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {
  const navigate = useNavigate();

  return (
    <div className="featured-section">
      <h2>FEATURED PRODUCTS</h2>

      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-image"></div>
            <p>{item.name}</p>
            <span className="price">₹{item.price.toLocaleString()}</span>

            <button
              className="view-btn"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
