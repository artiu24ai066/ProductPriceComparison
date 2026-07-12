import "./Categories.css";
import {
    Folder,
    ExternalLink,
    TrendingUp
} from "lucide-react";


const categories = [

    {
        id: 1,
        name: "Smartphones",
        products: 2450,
        comparisons: "12.4K",
        trend: "High"
    },

    {
        id: 2,
        name: "Laptops",
        products: 890,
        comparisons: "5.8K",
        trend: "Medium"
    },

    {
        id: 3,
        name: "Smart Watches",
        products: 420,
        comparisons: "2.1K",
        trend: "High"
    },

    {
        id: 4,
        name: "Headphones",
        products: 760,
        comparisons: "4.6K",
        trend: "Medium"
    },

    {
        id: 5,
        name: "Gaming Accessories",
        products: 530,
        comparisons: "3.2K",
        trend: "Growing"
    }

];


const Categories = () => {


    return (

        <div className="categories-page">


            <div className="categories-header">


                <div>

                    <h1>
                        Categories
                    </h1>

                    <p>
                        Manage product categories and comparison activity.
                    </p>

                </div>



                <button>
                    Add Category
                </button>



            </div>




            <div className="category-grid">


                {
                    categories.map(category => (


                        <div
                            className="category-card"
                            key={category.id}
                        >


                            <div className="category-icon">

                                <Folder size={26} />

                            </div>



                            <div className="category-info">


                                <h3>
                                    {category.name}
                                </h3>


                                <p>
                                    {category.products} Products
                                </p>


                            </div>




                            <div className="category-stats">


                                <div>

                                    <span>
                                        Comparisons
                                    </span>

                                    <strong>
                                        {category.comparisons}
                                    </strong>

                                </div>




                                <div>

                                    <span>
                                        Trend
                                    </span>


                                    <strong className="trend">

                                        <TrendingUp size={15} />

                                        {category.trend}

                                    </strong>


                                </div>


                            </div>




                            <button className="category-view">

                                <ExternalLink size={18} />

                            </button>



                        </div>


                    ))

                }


            </div>



        </div>

    )

}


export default Categories;