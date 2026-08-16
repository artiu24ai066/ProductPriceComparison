import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Bell, Target } from "lucide-react";
import "./PriceAlertModal.css";

const PriceAlertModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTargetPrice("");
      setError("");
      setWarning("");
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Extract product information
  const title = product?.canonicalTitle || product?.brand || "Product";
  const image = product?.images?.primary || product?.images?.gallery?.[0] || "";
  const currentPrice = product?.priceStats?.lowest || product?.sellers?.[0]?.price || 0;
  const selectedOffer = product?.sellers?.[0];
  const store = selectedOffer?.sellerName || selectedOffer?.website || "Unknown Store";

  const formatPrice = (price) => 
    price ? `₹${Number(price).toLocaleString("en-IN")}` : "N/A";

  const validateTargetPrice = (price) => {
    const numPrice = parseFloat(price);
    
    if (!price.trim()) {
      return "Please enter a target price";
    }
    
    if (isNaN(numPrice) || numPrice <= 0) {
      return "Please enter a valid price greater than 0";
    }
    
    // Check if target price is higher than current price
    if (numPrice >= currentPrice && currentPrice > 0) {
      return null; // No error, but we'll show a warning
    }
    
    return null;
  };

  const handleTargetPriceChange = (e) => {
    const value = e.target.value;
    setTargetPrice(value);
    
    const validationError = validateTargetPrice(value);
    setError(validationError || "");
    
    // Check for warning when target is above current price
    const numPrice = parseFloat(value);
    if (!validationError && numPrice >= currentPrice && currentPrice > 0) {
      setWarning(`Your target price is above the current price (${formatPrice(currentPrice)}). You'll be notified if the price increases to your target.`);
    } else {
      setWarning("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationError = validateTargetPrice(targetPrice);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    const numPrice = parseFloat(targetPrice);
    onSubmit(numPrice);
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the overlay background
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Render modal using portal to ensure it appears at document body level
  return createPortal(
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">
              <Bell size={24} />
            </div>
            <div>
              <h2>Set Price Alert</h2>
              <p>Get notified when the price drops</p>
            </div>
          </div>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div className="modal-product-info">
          <div className="product-info-left">
            {image && (
              <img 
                src={image} 
                alt={title}
                className="product-info-image"
              />
            )}
          </div>
          <div className="product-info-right">
            <h3>{title}</h3>
            <div className="product-info-details">
              <div className="info-item">
                <span className="info-label">Store:</span>
                <span className="info-value">{store}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Current Price:</span>
                <span className="info-value current-price">
                  {formatPrice(currentPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          
          <div className="form-group">
            <label htmlFor="targetPrice" className="form-label">
              <Target size={16} />
              Notify me when price drops to:
            </label>
            <div className="price-input-container">
              <span className="currency-symbol">₹</span>
              <input
                id="targetPrice"
                type="number"
                value={targetPrice}
                onChange={handleTargetPriceChange}
                placeholder="Enter target price"
                className={`price-input ${error ? "error" : ""}`}
                min="1"
                step="1"
              />
            </div>
            {error && <span className="error-message">{error}</span>}
            {warning && <span className="warning-message">{warning}</span>}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Set Alert
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};

export default PriceAlertModal;