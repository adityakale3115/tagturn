import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, ArrowRight } from "lucide-react";
import "../styles/Footer.css";

export default function Footer() {
  const sections = [
    {
      title: "Shop",
      items: ["New Drops", "Collections", "Accessories", "Lookbook"]
    },
    {
      title: "Support",
      items: ["Order Tracking", "Shipping Policy", "Returns", "Contact Us"]
    },
    {
      title: "Company",
      items: ["About TagTurn", "Sustainability", "Careers", "Archive Ethos"]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top: Brand & Newsletter */}
        <div className="footer-top">
          <div className="brand-side">
            <h2 className="footer-logo">TAGTURN</h2>
            <p className="brand-tagline">Curating high-end archive streetwear for the modern silhouette.</p>
          </div>
          <div className="newsletter-side">
            <p className="newsletter-label">Stay in the loop</p>
            <div className="subscribe-box">
              <input type="email" placeholder="Email Address" />
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
                  <li key={i}>
                    <a href="/" onClick={(e) => e.preventDefault()}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: Socials & Copyright */}
        <div className="footer-bottom">
          <div className="socials">
            <a href="/" onClick={(e) => e.preventDefault()}><Facebook size={18} /></a>
            <a href="https://www.instagram.com/tagturn.in" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
            <a href="/" onClick={(e) => e.preventDefault()}><Youtube size={18} /></a>
            <a href="/" onClick={(e) => e.preventDefault()}><Twitter size={18} /></a>
          </div>
          <p className="copyright">© 2026 TAGTURN ARCHIVE. ALL RIGHTS RESERVED.</p>
        </div>
        
      </div>
    </footer>
  );
}