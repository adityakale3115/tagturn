import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Navbar from "../components/Navbar";
import { Loader2, ArrowLeft } from "lucide-react";
import "../styles/ShopPage.css";

export default function ShopPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        // Fetch Vendor Info from 'vendors' collection
        const vendorRef = doc(db, "vendors", shopId);
        const vendorSnap = await getDoc(vendorRef);
        if (vendorSnap.exists()) setVendor(vendorSnap.data());

        // Fetch Products uploaded by this shop
        const q = query(collection(db, "products"), where("shop_id", "==", shopId));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, [shopId]);

  if (loading) return (
    <div className="stealth-preloader"><Loader2 className="animate-spin" size={32} /></div>
  );

  return (
    <div className="stealth-page-wrapper">
      <Navbar />
      <div className="shop-archive-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> <span>RETURN_TO_COLLECTION</span>
        </button>

        <header className="shop-header">
          <span className="vendor-hex">// SRC_ID: {shopId.slice(0, 8)}</span>
          <h1 className="shop-title">{vendor?.shopName || "AUTHENTIC_SOURCE"}</h1>
          <p className="shop-contact">{vendor?.email}</p>
          <div className="shop-count">ARCHIVED_ENTRIES: [ {products.length} ]</div>
        </header>

        <div className="product-grid-stealth">
          {products.map((item) => (
            <div key={item.id} className="item-card" onClick={() => navigate(`/product/${item.id}`)}>
              <div className="item-img-container">
                <img src={item.images?.[0]} alt={item.name} />
                {item.condition && <span className="cond-tag">C:{item.condition}/10</span>}
              </div>
              <div className="item-meta">
                <h3>{item.name}</h3>
                <p>₹{item.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}