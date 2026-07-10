import "./ProductCard.css";

import {
  Heart,
  Star,
  Sparkles,
  ChevronRight,
  Store,
  Truck,
  BadgePercent,
} from "lucide-react";

const ProductCard = () => {
  return (
    <div className="product-card">

      {/* ================= IMAGE ================= */}

      <div className="product-image-section">

        <button className="wishlist-btn">
          <Heart size={18} />
        </button>

        <div className="ai-match">
          <Sparkles size={14} />
          <span>97%</span>
        </div>

        <img
          src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700"
          alt="iphone"
          className="product-image"
        />

      </div>

      {/* ================= CONTENT ================= */}

      <div className="product-content">

        {/* Tags */}

        <div className="product-tags">

          <span className="tag trending">
            🔥 Trending
          </span>

          <span className="tag offer">
            <BadgePercent size={13} />
            Best Offer
          </span>

        </div>

        {/* Title */}

        <h3 className="product-title">
          Apple iPhone 19 Pro Max 256GB Black
        </h3>

        {/* Rating */}

        <div className="product-rating">

          <Star size={16} fill="#FDBA12" strokeWidth={1.5} />

          <span>4.8</span>

          <small>(18.4K Reviews)</small>

        </div>

        {/* Price */}

        <div className="price-section">

          <div>

            <small>Starting From</small>

            <h2>₹1,24,999</h2>

          </div>

          <div className="saving-box">

            Save

            <span>₹4,800</span>

          </div>

        </div>

        {/* Stores */}

        <div className="stores-list">

          <div className="store lowest">

            <div className="store-left">

              <Store size={16} />

              Amazon

            </div>

            <div className="store-right">

              ₹1,24,999

            </div>

          </div>

          <div className="store">

            <div className="store-left">

              <Store size={16} />

              Flipkart

            </div>

            <div className="store-right">

              ₹1,25,899

            </div>

          </div>

          <div className="store">

            <div className="store-left">

              <Store size={16} />

              Croma

            </div>

            <div className="store-right">

              ₹1,26,499

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="product-footer">

          <button className="compare-btn">

            Compare

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;