    import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/ExploreCategories.css";

export default function ExploreCategories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const snap = await getDocs(collection(db, "categories"));
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-section">
      <h2 className="featured-title">Explore by Category</h2>

      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="category-card"
            onClick={() => navigate(`/category/${cat.name}`)}
          >
            <div className="category-image">
              <img src={cat.image} alt={cat.name} />
            </div>
            <p className="category-name">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
