import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../styles/CategoryProducts.css";

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), where("category", "==", categoryName));
        const snap = await getDocs(q);

        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className="category-product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="page-title">{categoryName} </h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : products.length === 0 ? (
        <p className="empty-text">No products available in this category.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="product-img">
                <img src={p.images?.[0]} alt={p.name} />
              </div>
              <h3 className="product-name">{p.name}</h3>
              <p className="product-price">₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
