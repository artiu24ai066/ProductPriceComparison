import "./RelatedProducts.css";
import { useMemo } from "react";

const RelatedProducts = ({ products = [] }) => {
  const items = useMemo(() => {
    const source = products
      .filter(Boolean)
      .map((product) => {
        const title = product?.canonicalTitle || product?.brand || product?.name || "Product";
        const image = product?.images?.primary || product?.images?.gallery?.[0] || product?.image || "";
        const priceValue = product?.priceStats?.lowest ?? product?.price ?? null;
        const sourceUrl = product?.lowestPriceSeller?.url || product?.cheapestAvailableSeller?.url || product?.sellers?.[0]?.url || product?.url || "";

        return {
          id: product?._id || product?.id || product?.groupId || title,
          title,
          image,
          priceText: priceValue != null ? `₹${Number(priceValue).toLocaleString("en-IN")}` : "",
          sourceUrl,
        };
      });

    if (!source.length) return [];

    for (let index = source.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [source[index], source[randomIndex]] = [source[randomIndex], source[index]];
    }

    if (source.length >= 20) {
      return source.slice(0, 20);
    }

    const repeated = [];
    while (repeated.length < 20) {
      repeated.push(source[repeated.length % source.length]);
    }

    return repeated.slice(0, 20);
  }, [products]);

  const beltItems = items.length ? [...items, ...items] : [];

  return (
    <section className="related-section">
      <div className="related-heading">
        <span>SIMILAR PRODUCTS</span>
        <h2>Related Products</h2>
        <p>Compare similar products from the current search results.</p>
      </div>

      <div className="related-slider">
        <div className="related-track">
          {beltItems.map((item, index) => {
            const title = item?.title || "Product";
            const image = item?.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600";
            const price = item?.priceText || "";

            return (
              <div className="mini-card" key={item?.id || item?.groupId || `${title}-${index}`}>
                <img src={image} alt={title} />

                <div className="mini-card-body">
                  <h4>{title}</h4>
                  <p>{price}</p>
                </div>

                <div className="mini-card-overlay">
                  {item?.sourceUrl ? (
                    <a
                      className="mini-card-btn"
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Explore Again
                    </a>
                  ) : (
                    <button className="mini-card-btn" type="button" disabled>
                      Explore Again
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;



