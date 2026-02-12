import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Loader2, Store, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/AllShops.css";

export default function AllShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        // Querying for all approved vendors based on database field 'status'
        const q = query(collection(db, "vendors"), where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        
        const shopList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Auth UID used as Document ID
          ...doc.data()
        }));
        
        setShops(shopList);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading) return (
    <div className="stealth-preloader">
      <Loader2 className="animate-spin" size={32} />
      <span className="boot-tag">SYNCING_VENDORS...</span>
    </div>
  );

  return (
    <div className="stealth-page-wrapper">
      <Navbar />
      <div className="all-shops-container">
        <header className="shops-header">
          <span className="archive-tag">{/* DIRECTORY: REGISTERED_VENDORS */}// DIRECTORY: REGISTERED_VENDORS</span>
          <h1 className="archive-title">VENDORS_ARCHIVE</h1>
          <p className="archive-subtitle">Browse curated collections from our verified archival sources.</p>
        </header>

        <div className="shops-grid">
          {shops.length > 0 ? (
            shops.map((shop) => (
              <div 
                key={shop.id} 
                className="shop-card" 
                onClick={() => navigate(`/shop/${shop.id}`)}
              >
                <div className="shop-card-icon">
                  <Store size={40} strokeWidth={1} />
                </div>
                <div className="shop-card-content">
                  {/* Pulls shopName and email from Firestore document */}
                  <h2 className="shop-card-name">{shop.shopName || "UNNAMED_SHOP"}</h2>
                  <p className="shop-card-email">{shop.email}</p>
                  <div className="shop-card-footer">
                    <span>VIEW_COLLECTION</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
                {/* Visual watermark using shop name prefix */}
                <div className="shop-card-bg-text">{shop.shopName?.slice(0, 4)}</div>
              </div>
            ))
          ) : (
            <div className="no-shops">
               <p>{/* ERROR: NO_APPROVED_VENDORS_FOUND */}// ERROR: NO_APPROVED_VENDORS_FOUND</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}