import { useEffect } from "react";
import "./Wishlist.css";
import {
  Heart,
  ExternalLink,
  Trash2,
  IndianRupee
} from "lucide-react";
import useAppDispatch from "../../../hooks/useAppDispatch";
import useAppSelector from "../../../hooks/useAppSelector";
import { loadWishlist, removeWishlistItem } from "../../../features/wishlist/wishlistSlice";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productKey) => {
    if (!productKey) return;
    dispatch(removeWishlistItem(productKey));
  };

  const handleView = (sourceUrl) => {
    if (!sourceUrl) return;
    window.open(sourceUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="wishlist-section">

      <div className="section-heading">

        <div>
          <h2>My Wishlist</h2>
          <p>Your saved products for future purchases.</p>
        </div>

        <span>{items.length} Products</span>

      </div>

      <div className="wishlist-grid">

        {loading && <div className="wishlist-empty">Loading your wishlist...</div>}

        {!loading && items.length === 0 && <div className="wishlist-empty">No wishlist products yet.</div>}

        {!loading && items.map((item) => (

          <div
            className="wishlist-card"
            key={item._id || item.productKey}
          >

            <div className="wishlist-image">

              <img
                src={item.image || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700"}
                alt={item.title}
              />

              <button>
                <Heart size={18} fill="currentColor"/>
              </button>

            </div>

            <div className="wishlist-content">

              <h3>{item.title}</h3>

              <div className="wishlist-price">

                <IndianRupee size={16}/>
                {item.priceText || (item.price != null ? `₹${Number(item.price).toLocaleString("en-IN")}` : "Price not available")}

              </div>

              <div className="wishlist-store">

                {item.storeName || "Store"}

              </div>

              <div className="wishlist-status">

                {item.metadata?.rating ? `${item.metadata.rating.toFixed(1)} ★` : "Saved in wishlist"}

              </div>

            </div>

            <div className="wishlist-actions">

              <button className="view-btn" onClick={() => handleView(item.sourceUrl || item.productSnapshot?.lowestPriceSeller?.url || item.productSnapshot?.sellers?.[0]?.url)}>

                <ExternalLink size={18}/>

                View

              </button>

              <button className="remove-btn" onClick={() => handleRemove(item.productKey)}>

                <Trash2 size={18}/>

                Remove

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Wishlist;