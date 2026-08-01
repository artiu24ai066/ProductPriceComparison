import "./RecentlyViewed.css";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RecentlyViewed = ({ products = [], emptyTitle = "Search products to populate this section", emptyDescription = "Once you open products from search results, they will appear here." }) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: -700,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: 700,
      behavior: "smooth",
    });
  };

  const items = products.slice(0, 50);

  return (
    <section className="recent-section">
      <div className="recent-heading">
        <span>YOUR HISTORY</span>

        <h2>Recently Viewed</h2>

        <p>Continue comparing products you've explored before.</p>
      </div>

      <div className="recent-carousel">
        {items.length > 0 && (
          <button
            className="carousel-arrow left"
            onClick={scrollLeft}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {items.length ? (
          <div
            className="recent-slider"
            ref={sliderRef}
          >
            <div className="recent-track">
              {items.map((item, index) => {
                const title = item?.title || item?.canonicalTitle || item?.brand || item?.name || "Product";
                const image = item?.image || item?.images?.primary || item?.images?.gallery?.[0] || "";
                const price = item?.priceText || (item?.price != null ? `₹${Number(item.price).toLocaleString("en-IN")}` : "");
                const sourceUrl = item?.sourceUrl || item?.productSnapshot?.lowestPriceSeller?.url || item?.productSnapshot?.cheapestAvailableSeller?.url || item?.productSnapshot?.sellers?.[0]?.url || item?.productSnapshot?.url || "";

                return (
                  <div className="recent-card" key={item?._id || item?.productKey || item?.id || `${title}-${index}`}>
                    <img className="recent-image" src={image} alt={title} />

                    <div className="recent-overlay">
                      {sourceUrl ? (
                        <a className="recent-overlay-btn" href={sourceUrl} target="_blank" rel="noopener noreferrer">
                          Explore Again
                        </a>
                      ) : (
                        <button className="recent-overlay-btn" type="button" disabled>
                          Explore Again
                        </button>
                      )}
                    </div>

                    <h4>{title}</h4>

                    <p>{price}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="recent-empty-state">
            <h3>{emptyTitle}</h3>
            <p>{emptyDescription}</p>
          </div>
        )}

        {items.length > 0 && (
          <button
            className="carousel-arrow right"
            onClick={scrollRight}
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </section>
  );
};

export default RecentlyViewed;