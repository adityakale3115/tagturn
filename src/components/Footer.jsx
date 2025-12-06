import { Facebook, Instagram, Youtube, Twitter, Smartphone, Package, RefreshCw } from "lucide-react";
import "../styles/Footer.css";

export default function Footer() {
  const shopFor = [
    "Starwars Shirt",
    "Disney Shirt",
    "Captain America Shirt",
    "Harry Potter Shirt",
    "Deadpool Shirt",
    "DC Shirt"
  ];

  const needHelp = [
    "Contact Us",
    "Track Order",
    "Returns & Refunds",
    "FAQs",
    "My Account"
  ];

  const company = [
    "About Us",
    "Investor Relations",
    "Careers",
    "Gift Vouchers",
    "Community Initiatives"
  ];

  const moreInfo = [
    "T&C",
    "Privacy Policy",
    "Sitemap",
    "Get Notified",
    "Blogs"
  ];

  const stores = [
    "Mumbai",
    "Pune",
    "Bangalore",
    "Hubbali"
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Shop For */}
          <div className="footer-column">
            <h3 className="footer-title">Shop For</h3>
            <div className="footer-links">
              {shopFor.map((item, idx) => (
                <a key={idx} href="#" className="footer-link">{item}</a>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="footer-column">
            <h3 className="footer-title">Need Help</h3>
            <div className="footer-links">
              {needHelp.map((item, idx) => (
                <a key={idx} href="#" className="footer-link">{item}</a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <div className="footer-links">
              {company.map((item, idx) => (
                <a key={idx} href="#" className="footer-link">{item}</a>
              ))}
            </div>
          </div>

          {/* More Info */}
          <div className="footer-column">
            <h3 className="footer-title">More Info</h3>
            <div className="footer-links">
              {moreInfo.map((item, idx) => (
                <a key={idx} href="#" className="footer-link">{item}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Store Near Me */}
        <div className="footer-grid" style={{ marginTop: '32px' }}>
          <div className="footer-column">
            <h3 className="footer-title">Store Near Me</h3>
            <div className="footer-links">
              {stores.map((store, idx) => (
                <a key={idx} href="#" className="footer-link">{store}</a>
              ))}
              <a href="#" className="footer-link view-more">View More</a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="footer-features">
          <div className="feature-item">
            <div className="feature-icon">
              <Package size={20} />
            </div>
            <span>COD Available</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <RefreshCw size={20} />
            </div>
            <span>30 Days Easy Returns & Exchanges</span>
          </div>
        </div>

        {/* App Download */}
        <div className="app-section">
          <p className="app-title">📱 Experience The TagTurn App</p>
          <div className="app-badges">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
              alt="Get it on Google Play" 
              className="app-badge"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
              alt="Download on App Store" 
              className="app-badge"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="social-section">
          <p className="social-label">Follow Us:</p>
          <div className="social-icons">
            <a href="#" className="social-icon facebook">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/tagturn.in?igsh=OG5hZHJ4bG95dG1u" className="social-icon instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="social-icon youtube">
              <Youtube size={20} />
            </a>
            <a href="#" className="social-icon twitter">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          © {new Date().getFullYear()} <strong>TAGTURN</strong> — All Rights Reserved
        </div>
      </div>
    </footer>
  );
}