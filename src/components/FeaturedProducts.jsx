import "./../styles/FeaturedProducts.css";
import products from "../data/products";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {
  const navigate = useNavigate();

  return (
    <div className="featured-section">
      <h2 className="featured-title">Featured Products</h2>

      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card" onClick={() => navigate(`/product/${item.id}`)}>
            
            <div className="product-image">
              <img src={item.images[0]} alt={item.name} />
            </div>

            <p className="product-name">{item.name}</p>
            <span className="price">₹{item.price.toLocaleString()}</span>

            <button
              className="view-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${item.id}`);
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
