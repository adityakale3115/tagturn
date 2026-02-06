import React from 'react';
import { ShieldCheck, Sparkles, Zap, ArrowUpRight } from 'lucide-react';
import "../styles/Features.css";

export default function BrandIntro() {
  return (
    <section className="brand-intro-section">
      <div className="bento-grid">
        
        {/* Main Feature Box */}
        <div className="bento-item main-feature">
          <div className="feature-header">
            <span className="stealth-tag">{"//"} THE NEW STANDARD</span>
            <h2 className="bento-title">WEAR THE <br/><span>ARCHIVE.</span></h2>
          </div>
          <p className="feature-text">
            India's premier digital marketplace for curated high-end streetwear 
            and ultra-limited archive drops.
          </p>
          <div className="bento-cta-group">
            <button className="brand-fill-btn">START HUNTING</button>
            <button className="brand-outline-btn">SELL GEAR</button>
          </div>
          <Sparkles className="bg-icon-watermark" size={200} />
        </div>

        {/* Top Right: Verified Box */}
        <div className="bento-item glass-box verified">
          <div className="box-top">
            <ShieldCheck className="accent-icon" size={24} />
            <span className="verify-tag">AUTHENTIC</span>
          </div>
          <h3>VERIFIED ARCHIVE</h3>
          <p>Every piece is authenticated by our specialist team.</p>
        </div>

        {/* Bottom Right: Alert Box */}
        <div className="bento-item accent-box alert">
          <div className="box-top">
            <Zap size={24} />
            <h3 className="alert-label">LIMITED OFFERS</h3>
          </div>
          <p className="alert-text">UP TO 40% OFF SELECT PIECES</p>
          <ArrowUpRight className="corner-arrow" />
        </div>

        {/* Long Bottom Row: Revolution Box */}
        <div className="bento-item long-box">
          <div className="long-content">
            <div className="revolution-text">
              <span className="mini-label">TAGTURN ETHOS</span>
              <h3>THE CURATED <br/> MARKETPLACE</h3>
            </div>
            <div className="revolution-desc">
              <p>
                Welcome to TagTurn — India's most trusted archive where you can 
                buy and sell pre-loved techwear and hyped streetwear. Join thousands 
                of conscious shoppers redefining the modern silhouette.
              </p>
              <div className="hashtag-row">
                <span>#EDITORIAL</span>
                <span>#TAGTURNINDIA</span>
                <span>#ARCHIVEFASHION</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}