import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import "../styles/RandomProduct.css";

export default function RandomProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        // Fetch a pool of 15 products to pick from
        const q = query(collection(db, "products"), limit(15));
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Shuffle the array and pick the first 4
        const shuffled = productList.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 4)); 
      } catch (error) {
        console.error("Error fetching random articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  if (loading) return (
    <div className="random-loader">
      <Loader2 className="animate-spin" size={24} />
      <span>SYNCING_DATABASE...</span>
    </div>
  );

  return (
    <section className="random-product-section">
      <div className="random-header">
        <h2 className="random-title">LATEST_DISCOVERIES</h2>
        <button className="random-view-all" onClick={() => navigate("/shop")}>
          EXPLORE_ALL <ArrowRight size={14} />
        </button>
      </div>

      <div className="random-grid">
        {products.map((item) => (
          <div 
            key={item.id} 
            className="random-card" 
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <div className="random-media">
              {/* Uses the images array from your Firestore structure */}
              <img src={item.images?.[0]} alt={item.name} />
              <div className="random-badge">NEW_ENTRY</div>
            </div>
            <div className="random-info">
              <p className="random-name">{item.name}</p>
              <p className="random-price">₹{item.price?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}