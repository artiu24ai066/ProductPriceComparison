import "./Analytics.css";
import {
    Search,
    GitCompare,
    MousePointerClick,
    TrendingUp
} from "lucide-react";


const analyticsCards = [

    {
        title: "Total Searches",
        value: "84,520",
        growth: "+18%",
        icon: <Search size={28} />
    },

    {
        title: "Comparisons Made",
        value: "32,480",
        growth: "+24%",
        icon: <GitCompare size={28} />
    },

    {
        title: "Store Clicks",
        value: "18,940",
        growth: "+12%",
        icon: <MousePointerClick size={28} />
    },

    {
        title: "Trending Products",
        value: "245",
        growth: "+9%",
        icon: <TrendingUp size={28} />
    }

];



const products = [

    {
        name: "iPhone 16 Pro",
        comparisons: "8,420",
        clicks: "3,210"
    },

    {
        name: "MacBook Air M4",
        comparisons: "6,850",
        clicks: "2,540"
    },

    {
        name: "Galaxy S25",
        comparisons: "5,430",
        clicks: "1,980"
    },

    {
        name: "Sony WH-1000XM6",
        comparisons: "3,920",
        clicks: "1,240"
    }

];



const Analytics = () => {


    return (

        <div className="analytics-page">



            <div className="analytics-header">

                <div>

                    <h1>
                        Analytics
                    </h1>

                    <p>
                        Track searches, comparisons and user interaction.
                    </p>

                </div>


            </div>




            <div className="analytics-cards">


                {
                    analyticsCards.map(card => (


                        <div
                            className="analytics-card"
                            key={card.title}
                        >


                            <div className="analytics-icon">

                                {card.icon}

                            </div>


                            <div>

                                <p>
                                    {card.title}
                                </p>


                                <h2>
                                    {card.value}
                                </h2>


                                <span>
                                    {card.growth} this month
                                </span>


                            </div>


                        </div>


                    ))

                }


            </div>






            <div className="comparison-section">


                <h2>
                    Most Compared Products
                </h2>



                <div className="comparison-table">



                    <div className="comparison-head">

                        <span>
                            Product
                        </span>

                        <span>
                            Comparisons
                        </span>

                        <span>
                            Store Clicks
                        </span>


                    </div>





                    {
                        products.map((product, index) => (


                            <div
                                className="comparison-row"
                                key={index}
                            >


                                <h4>
                                    {product.name}
                                </h4>


                                <span>
                                    {product.comparisons}
                                </span>


                                <span>
                                    {product.clicks}
                                </span>



                            </div>


                        ))

                    }



                </div>


            </div>




        </div>

    )

}


export default Analytics;