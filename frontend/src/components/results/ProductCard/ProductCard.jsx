import { useMemo, useState } from "react";
import "./ProductCard.css";

import {
  Heart,
  Star,
  Sparkles,
  ChevronRight,
  Store,
  BadgePercent,
  Bell,
} from "lucide-react";

import useAppDispatch from "../../../hooks/useAppDispatch";
import useAppSelector from "../../../hooks/useAppSelector";
import { buildWishlistKey, toggleWishlistItem } from "../../../features/wishlist/wishlistSlice";
import PriceAlertModal from "../../common/PriceAlertModal/PriceAlertModal";

const ProductCard = ({ product, onCompare = () => {}, isCompared = false }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.wishlist);
  
  // Price Alert modal state
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);

  const title = product?.canonicalTitle || product?.brand || "Product";
  const image =
    product?.images?.primary ||
    product?.images?.gallery?.[0] ||
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700";

  const productKey = buildWishlistKey(product);

  const isWishlisted = useMemo(
    () => items.some((item) => item.productKey === productKey),
    [items, productKey]
  );

  const handleWishlistToggle = () => {
    if (!isAuthenticated || !product) return;
    dispatch(toggleWishlistItem(product));
  };

  const handlePriceAlertClick = () => {
    if (!isAuthenticated) {
      // Redirect to login - you may want to adjust this based on your routing
      window.location.href = '/login';
      return;
    }
    
    if (!product) return;
    
    setIsPriceAlertModalOpen(true);
  };

  const handlePriceAlertModalClose = () => {
    setIsPriceAlertModalOpen(false);
  };

  const handlePriceAlertSubmit = (targetPrice) => {
    // For Part 1, we'll just log the data and close the modal
    console.log('Price Alert Data:', {
      product,
      targetPrice,
      productKey: buildWishlistKey(product),
      selectedOffer: product?.sellers?.[0] || null
    });
    
    setIsPriceAlertModalOpen(false);
    
    // TODO: This will be connected to backend API in later parts
    alert(`Price alert set for ${targetPrice} - Backend connection coming in next part!`);
  };

  const lowestPrice = product?.priceStats?.lowest;
  const highestPrice = product?.priceStats?.highest;
  const savings =
    lowestPrice != null && highestPrice != null && highestPrice > lowestPrice
      ? highestPrice - lowestPrice
      : null;
  const rating = product?.overallRating || product?.sellers?.[0]?.rating || null;
  const reviewCount = product?.sellers?.[0]?.reviewCount || null;
  const topStores = (product?.sellers || [])
    .slice()
    .sort((a, b) => {
      const aPrice = a?.price ?? Infinity;
      const bPrice = b?.price ?? Infinity;
      return aPrice - bPrice;
    })
    .slice(0, 3);

  const formatPrice = (value) =>
    value != null ? `₹${Number(value).toLocaleString("en-IN")}` : "-";

  return (
    <div className="product-card">

      {/* ================= IMAGE ================= */}

      <div className="product-image-section">

        <button className={`wishlist-btn ${isWishlisted ? "active" : ""}`} type="button" onClick={handleWishlistToggle}>
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        <div className="ai-match">
          <Sparkles size={14} />
          <span>{product?.matching?.confidence ?? "--"}%</span>
        </div>

        <img
          src={image}
          alt={title}
          className="product-image"
        />

      </div>

      {/* ================= CONTENT ================= */}

      <div className="product-content">

        {/* Tags */}

        <div className="product-tags">
          {product?.brand ? (
            <span className="tag trending">{product.brand}</span>
          ) : null}

          <span className="tag offer">
            <BadgePercent size={13} />
            Best Offer
          </span>
        </div>

        {/* Title */}

        <h3 className="product-title">{title}</h3>

        {/* Rating */}

        <div className="product-rating">
          <Star size={16} fill="#FDBA12" strokeWidth={1.5} />
          <span>{rating != null ? rating.toFixed(1) : "N/A"}</span>
          <small>
            {reviewCount ? `(${reviewCount} Reviews)` : "No reviews yet"}
          </small>
        </div>

        {/* Price */}

        <div className="price-section">
          <div>
            <small>Starting From</small>
            <h2>{formatPrice(lowestPrice)}</h2>
          </div>

          {savings ? (
            <div className="saving-box">
              Save
              <span>{formatPrice(savings)}</span>
            </div>
          ) : null}
        </div>

        {/* Stores */}

        <div className="stores-list">
          {topStores.length ? (
            topStores.map((seller, index) => (
              <div
                className={`store ${index === 0 ? "lowest" : ""}`}
                key={`${seller.website}-${index}`}
              >
                <div className="store-left">
                  <Store size={16} />
                  {seller.sellerName || seller.website || "Store"}
                </div>
                <div className="store-right">{formatPrice(seller.price)}</div>
              </div>
            ))
          ) : (
            <div className="no-store-data">No store pricing available</div>
          )}
        </div>

        {/* Footer */}

        <div className="product-footer">
          <button
            className={`compare-btn ${isCompared ? "active" : ""}`}
            type="button"
            onClick={() => onCompare(product)}
          >
            {isCompared ? "Remove" : "Compare"}
            <ChevronRight size={18} />
          </button>

          <button
            className="price-alert-btn"
            type="button"
            onClick={handlePriceAlertClick}
            title="Set Price Alert"
          >
            <Bell size={16} />
            Price Alert
          </button>
        </div>

      </div>

      {/* Price Alert Modal - Rendered at body level via portal */}
      {isPriceAlertModalOpen && (
        <PriceAlertModal
          isOpen={isPriceAlertModalOpen}
          onClose={handlePriceAlertModalClose}
          onSubmit={handlePriceAlertSubmit}
          product={product}
        />
      )}

    </div>
  );
};

export default ProductCard;