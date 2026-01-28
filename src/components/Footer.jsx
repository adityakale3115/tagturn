import { Facebook, Instagram, Youtube, Twitter, Package, RefreshCw, ArrowRight } from "lucide-react";
import "../styles/Footer.css";

export default function Footer() {
  const sections = [
    { title: "Shop", items: ["Starwars", "Disney", "Marvel", "Harry Potter", "Deadpool", "DC Comics"] },
    { title: "Help", items: ["Contact Us", "Track Order", "Returns", "FAQs", "My Account"] },
    { title: "Company", items: ["About Us", "Investors", "Careers", "Gift Vouchers", "Community"] },
    { title: "Legal", items: ["T&C", "Privacy Policy", "Sitemap", "Get Notified", "Blogs"] }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top: Brand & Newsletter */}
        <div className="footer-top">
          <div className="brand-side">
            <h2 className="footer-logo">TAGTURN</h2>
            <p className="brand-tagline">Redefining urban elegance through premium streetwear.</p>
          </div>
          <div className="newsletter-side">
            <p className="newsletter-label">Stay in the loop</p>
            <div className="subscribe-box">
              <input type="email" placeholder="Enter your email" />
              <button><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* Middle: Links Grid */}
        <div className="footer-main-grid">
          {sections.map((sec, idx) => (
            <div key={idx} className="footer-col">
              <h4 className="col-title">{sec.title}</h4>
              <ul className="col-links">
                {sec.items.map((item, i) => (
                  <li key={i}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="footer-col stores">
            <h4 className="col-title">Store Locator</h4>
            <ul className="col-links">
              <li>Mumbai</li>
              <li>Pune</li>
              <li>Bangalore</li>
              <li className="view-more-link">View All Stores →</li>
            </ul>
          </div>
        </div>

        {/* Features Bar */}
        <div className="footer-features-bar">
          <div className="feat-item">
            <Package size={18} className="feat-icon" />
            <span>COD AVAILABLE</span>
          </div>
          <div className="feat-item">
            <RefreshCw size={18} className="feat-icon" />
            <span>30 DAYS RETURNS</span>
          </div>
        </div>

        {/* Bottom: Apps & Socials */}
        <div className="footer-bottom">
          <div className="apps">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
          </div>

          <div className="socials">
            <a href="#"><Facebook size={18} /></a>
            <a href="https://www.instagram.com/tagturn.in"><Instagram size={18} /></a>
            <a href="#"><Youtube size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
          </div>
        </div>

        <div className="copyright-bar">
          <span>© {new Date().getFullYear()} TAGTURN.IN</span>
          <span>CRAFTED IN INDIA</span>
        </div>
      </div>
    </footer>
  );
}