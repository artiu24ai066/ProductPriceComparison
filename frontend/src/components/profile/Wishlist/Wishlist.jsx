import "./Wishlist.css";
import {
  Heart,
  ExternalLink,
  Trash2,
  ShoppingCart,
  IndianRupee
} from "lucide-react";

const wishlist = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700",
    name: "iPhone 16 Pro",
    price: "₹1,12,999",
    store: "Amazon",
    status: "Price Stable"
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700",
    name: "Samsung S25 Ultra",
    price: "₹98,999",
    store: "Flipkart",
    status: "Dropped ₹2,000"
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700",
    name: "Apple Watch Ultra",
    price: "₹74,999",
    store: "Croma",
    status: "Price Stable"
  }
];

const Wishlist = () => {
  return (
    <div className="wishlist-section">

      <div className="section-heading">

        <div>
          <h2>My Wishlist</h2>
          <p>Your saved products for future purchases.</p>
        </div>

        <span>{wishlist.length} Products</span>

      </div>

      <div className="wishlist-grid">

        {wishlist.map((item) => (

          <div
            className="wishlist-card"
            key={item.id}
          >

            <div className="wishlist-image">

              <img
                src={item.image}
                alt={item.name}
              />

              <button>
                <Heart size={18}/>
              </button>

            </div>

            <div className="wishlist-content">

              <h3>{item.name}</h3>

              <div className="wishlist-price">

                <IndianRupee size={16}/>
                {item.price}

              </div>

              <div className="wishlist-store">

                {item.store}

              </div>

              <div className="wishlist-status">

                {item.status}

              </div>

            </div>

            <div className="wishlist-actions">

              <button className="view-btn">

                <ExternalLink size={18}/>

                View

              </button>

              <button className="remove-btn">

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