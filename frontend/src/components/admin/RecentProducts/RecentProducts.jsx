import "./RecentProducts.css";
import { ExternalLink } from "lucide-react";

const products = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
        name: "iPhone 16 Pro",
        category: "Mobile",
        lowestPrice: "₹1,09,999",
        store: "Amazon",
        updated: "2 min ago",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200",
        name: "MacBook Air M4",
        category: "Laptop",
        lowestPrice: "₹94,999",
        store: "Croma",
        updated: "8 min ago",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200",
        name: "Galaxy Watch 7",
        category: "Smartwatch",
        lowestPrice: "₹28,499",
        store: "Flipkart",
        updated: "15 min ago",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
        name: "Sony WH-1000XM6",
        category: "Headphones",
        lowestPrice: "₹27,990",
        store: "Reliance Digital",
        updated: "22 min ago",
    },
];

const RecentProducts = () => {
    return (
        <div className="recent-products">

            <div className="recent-products-header">
                <div>
                    <h2>Recent Price Updates</h2>
                    <p>Latest products with updated prices</p>
                </div>

                <button>View All</button>
            </div>

            <div className="products-table">

                <div className="table-head">

                    <span>Product</span>

                    <span>Lowest Price</span>

                    <span>Store</span>

                    <span>Updated</span>

                    <span></span>

                </div>

                {products.map((product) => (

                    <div className="table-row" key={product.id}>

                        <div className="product-info">

                            <img src={product.image} alt={product.name} />

                            <div>

                                <h4>{product.name}</h4>

                                <p>{product.category}</p>

                            </div>

                        </div>

                        <span className="price">{product.lowestPrice}</span>

                        <span>{product.store}</span>

                        <span>{product.updated}</span>

                        <button className="view-btn">

                            <ExternalLink size={18} />

                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default RecentProducts;