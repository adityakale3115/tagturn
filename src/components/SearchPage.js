import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore"; // Removed query and where

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get("q") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        
        const allProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const filtered = allProducts.filter(item => 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  if (loading) return <div style={styles.loader}>Loading products...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SEARCH RESULTS FOR: "{searchTerm.toUpperCase()}"</h1>
      
      {products.length > 0 ? (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
              <img 
                src={product.images && product.images[0]} 
                alt={product.name} 
                style={styles.image} 
              />
              <div style={styles.info}>
                <h3 style={styles.prodName}>{product.name}</h3>
                <p style={styles.category}>{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noResults}>
          <p>No items found for "{searchTerm}".</p>
          <button style={styles.btn} onClick={() => navigate("/")}>BACK TO SHOP</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "120px 5% 60px", background: "#000", minHeight: "100vh", color: "#fff" },
  loader: { padding: "150px", textAlign: "center", color: "#fff", background: "#000", height: "100vh" },
  title: { fontSize: "1.2rem", letterSpacing: "2px", marginBottom: "40px", borderBottom: "1px solid #333", paddingBottom: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" },
  card: { cursor: "pointer", transition: "0.3s" },
  image: { width: "100%", aspectRatio: "3/4", objectFit: "cover", backgroundColor: "#1a1a1a" },
  info: { marginTop: "10px" },
  prodName: { fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase" },
  category: { fontSize: "0.8rem", color: "#888" },
  noResults: { textAlign: "center", marginTop: "100px" },
  btn: { marginTop: "20px", padding: "10px 20px", cursor: "pointer", background: "#fff", border: "none" }
};