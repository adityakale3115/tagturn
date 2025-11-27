import "./../styles/FeaturedProducts.css";

export default function FeaturedProducts() {
  return (
    <div className="featured-section">
      <h2>FEATURED PRODUCTS</h2>

      <div className="product-grid">
        {[1,2,3,4].map((item)=> (
          <div key={item} className="product-card">
            <div className="product-image"></div>
            <p>Product {item}</p>
            <span>₹999</span>
          </div>
        ))}
      </div>
    </div>
  );
}
