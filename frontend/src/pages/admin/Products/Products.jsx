import "./Products.css";
import {
    Search,
    ExternalLink,
    TrendingDown
} from "lucide-react";


const products = [
    {
        id: 1,
        name: "iPhone 16 Pro",
        category: "Smartphone",
        stores: 8,
        price: "₹1,09,999",
        status: "Tracking"
    },
    {
        id: 2,
        name: "MacBook Air M4",
        category: "Laptop",
        stores: 6,
        price: "₹94,999",
        status: "Tracking"
    },
    {
        id: 3,
        name: "Sony WH-1000XM6",
        category: "Headphones",
        stores: 5,
        price: "₹27,990",
        status: "Paused"
    },
    {
        id: 4,
        name: "Samsung Galaxy Watch 7",
        category: "Smartwatch",
        stores: 7,
        price: "₹28,499",
        status: "Tracking"
    }
];


const Products = () => {


    return (

        <div className="products-page">


            <div className="products-header">

                <div>

                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage products, prices and comparison sources.
                    </p>

                </div>


                <button>
                    Add Product
                </button>


            </div>



            <div className="product-search">

                <Search size={20} />

                <input
                    placeholder="Search products..."
                />

            </div>



            <div className="products-table-admin">


                <div className="products-head">

                    <span>
                        Product
                    </span>

                    <span>
                        Category
                    </span>

                    <span>
                        Stores
                    </span>

                    <span>
                        Lowest Price
                    </span>

                    <span>
                        Status
                    </span>

                    <span>
                    </span>

                </div>



                {
                    products.map(product => (


                        <div
                            className="products-row"
                            key={product.id}
                        >


                            <div className="product-name">

                                <div className="product-icon">
                                    <TrendingDown size={22} />
                                </div>


                                <div>

                                    <h4>
                                        {product.name}
                                    </h4>

                                    <p>
                                        Price comparison active
                                    </p>

                                </div>


                            </div>


                            <span>
                                {product.category}
                            </span>


                            <span>
                                {product.stores} Stores
                            </span>


                            <span className="product-price">
                                {product.price}
                            </span>



                            <span
                                className={
                                    product.status === "Tracking"
                                        ?
                                        "status active"
                                        :
                                        "status pause"
                                }
                            >

                                {product.status}

                            </span>



                            <button className="view-product">

                                <ExternalLink size={18} />

                            </button>



                        </div>


                    ))

                }


            </div>


        </div>

    )

}


export default Products;