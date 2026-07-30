import "./RecentlyViewed.css";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackProducts = [
  {
    id: 1,
    name: "iPhone 18 Pro",
    price: "₹1,08,999",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
  },
  {
    id: 2,
    name: "Pixel 10 Pro",
    price: "₹89,999",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
  },
  {
    id: 3,
    name: "Galaxy S29 Ultra",
    price: "₹99,999",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
  },
  {
    id: 4,
    name: "Nothing Phone 3",
    price: "₹49,999",
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600",
  },
  {
    id: 5,
    name: "OnePlus 14",
    price: "₹64,999",
    image:
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600",
  },
  {
    id: 6,
    name: "Motorola Edge Ultra",
    price: "₹58,999",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
  },
  {
    id: 7,
    name: "Xiaomi 18 Ultra",
    price: "₹72,999",
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600",
  },
];

const RecentlyViewed = ({ products = [] }) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -700,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: 700,
      behavior: "smooth",
    });
  };

  const items = products.length ? products.slice(0, 8) : fallbackProducts;

  return (
    <section className="recent-section">
      <div className="recent-heading">
        <span>YOUR HISTORY</span>

        <h2>Recently Viewed</h2>

        <p>Continue comparing products you've explored before.</p>
      </div>

      <div className="recent-carousel">
        <button
          className="carousel-arrow left"
          onClick={scrollLeft}
        >
          <ChevronLeft size={28} />
        </button>

        <div
          className="recent-slider"
          ref={sliderRef}
        >
          <div className="recent-track">
            {items.map((item, index) => {
              const title = item?.canonicalTitle || item?.brand || item?.name || "Product";
              const image = item?.images?.primary || item?.images?.gallery?.[0] || item?.image || fallbackProducts[index % fallbackProducts.length].image;
              const price = item?.priceStats?.lowest != null
                ? `₹${Number(item.priceStats.lowest).toLocaleString("en-IN")}`
                : item?.price || fallbackProducts[index % fallbackProducts.length].price;

              return (
                <div className="recent-card" key={item?.id || item?.groupId || `${title}-${index}`}>
                  <img className="recent-image"
                    src={image}
                    alt={title}
                  />

                  <div className="recent-overlay">
                    <button className="recent-overlay-btn">
                      Explore Again
                    </button>
                  </div>

                  <h4>{title}</h4>

                  <p>{price}</p>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="carousel-arrow right"
          onClick={scrollRight}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
};

export default RecentlyViewed;