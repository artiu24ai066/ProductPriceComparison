import "./RelatedProducts.css";

const products = [
  {
    id: 1,
    name: "Samsung Galaxy S30 Ultra",
    price: "₹1,09,999",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
  },
  {
    id: 2,
    name: "Google Pixel 11 Pro",
    price: "₹94,999",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
  },
  {
    id: 3,
    name: "OnePlus 15",
    price: "₹67,999",
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600",
  },
  {
    id: 4,
    name: "Nothing Phone 4",
    price: "₹56,999",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600",
  },
  {
    id: 5,
    name: "Xiaomi 17 Pro",
    price: "₹74,999",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
  },
];

const RelatedProducts = () => {
  return (
    <section className="related-section">

      <div className="related-heading">
        <span>SIMILAR PRODUCTS</span>
        <h2>Related Products</h2>
        <p>Compare similar smartphones from different brands.</p>
      </div>

      <div className="related-slider">

        <div className="related-track">

          {[...products, ...products].map((item, index) => (

            <div className="mini-card" key={index}>

              <img src={item.image} alt={item.name} />

              <h4>{item.name}</h4>

              <p>{item.price}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default RelatedProducts;