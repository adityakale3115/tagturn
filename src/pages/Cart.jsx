import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, loading, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (loading) return (
    <div className="stealth-loader">
      <Loader2 className="animate-spin" />
      <span className="loader-text">SYNCING_ARCHIVE...</span>
    </div>
  );

  return (
    <div className="cart-theme-wrapper">
      <Navbar />
      <div className="cart-container">
        
        {/* Header with Navigation */}
        <header className="cart-header">
          <button className="back-to-store" onClick={() => navigate("/")}>
            <ChevronLeft size={16} /> BACK_TO_SEARCH
          </button>
          <h1 className="cart-main-title">YOUR ARCHIVE <span>[{cartItems.length}]</span></h1>
        </header>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <ShoppingBag size={48} className="empty-icon" />
            <h2 className="empty-title">BAG_IS_EMPTY</h2>
            <p className="empty-desc">Your personal archive is currently unpopulated.</p>
            <button className="explore-btn-neon" onClick={() => navigate("/")}>BROWSE_COLLECTIONS</button>
          </div>
        ) : (
          <div className="cart-grid-layout">
            
            {/* Left: Item List */}
            <div className="cart-items-column">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="stealth-cart-card">
                  <div className="item-visual-wrap" onClick={() => navigate(`/product/${item.id}`)}>
                    <img src={item.image} alt={item.name} className="item-visual" />
                  </div>
                  
                  <div className="item-details">
                    <div className="detail-top">
                      <span className="brand-subtext">TAGTURN // ARCHIVE_PIECE</span>
                      <h3 className="item-title">{item.name}</h3>
                      <p className="item-meta">SIZE: <b>{item.size}</b></p>
                    </div>

                    <div className="detail-bottom">
                      <div className="stealth-qty-control">
                        <button onClick={() => updateQuantity(item.id, item.size, -1)}><Minus size={14} /></button>
                        <span className="qty-num">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, 1)}><Plus size={14} /></button>
                      </div>
                      
                      <div className="price-box">
                        <p className="item-price-now">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <button className="stealth-remove-btn" onClick={() => removeFromCart(item.id, item.size)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Summary Sidebar */}
            <aside className="summary-sidebar">
              <div className="summary-glass-card">
                <h2 className="summary-title">ORDER_SUMMARY</h2>
                <div className="summary-rows">
                  <div className="s-row">
                    <span>ARTICLES</span>
                    <span>{cartItems.length}</span>
                  </div>
                  <div className="s-row">
                    <span>SHIPPING</span>
                    <span className="free-text">FREE</span>
                  </div>
                  <div className="divider-neon"></div>
                  <div className="s-row total">
                    <span>TOTAL</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <button className="checkout-btn-stealth" onClick={() => navigate("/checkout")}>
                  PROCEED_TO_CHECKOUT <ArrowRight size={16} />
                </button>
                <p className="secure-text">ENCRYPTED_TRANSACTION_PROTOCOL_V.2.6</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}