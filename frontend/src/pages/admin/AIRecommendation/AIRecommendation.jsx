import "./AIRecommendation.css";
import {
    Sparkles,
    TrendingUp,
    ExternalLink
} from "lucide-react";


const recommendations = [

    {
        id: 1,
        product: "iPhone 16 Pro",
        category: "Smartphone",
        views: "12,540",
        clicks: "4,820",
        performance: "High"
    },

    {
        id: 2,
        product: "MacBook Air M4",
        category: "Laptop",
        views: "9,820",
        clicks: "3,560",
        performance: "High"
    },

    {
        id: 3,
        product: "Sony WH-1000XM6",
        category: "Headphones",
        views: "6,430",
        clicks: "1,980",
        performance: "Medium"
    },

    {
        id: 4,
        product: "Galaxy Watch 7",
        category: "Smartwatch",
        views: "5,210",
        clicks: "1,240",
        performance: "Medium"
    }

];



const AIRecommendation = () => {


    return (

        <div className="ai-page">


            <div className="ai-header">

                <div>

                    <h1>
                        AI Recommendation
                    </h1>

                    <p>
                        Monitor AI-powered product suggestions and user interactions.
                    </p>

                </div>


            </div>





            <div className="ai-summary">


                <div className="ai-card">

                    <Sparkles />

                    <div>

                        <span>
                            Recommendations Generated
                        </span>

                        <h2>
                            28,450
                        </h2>

                    </div>


                </div>



                <div className="ai-card">

                    <TrendingUp />

                    <div>

                        <span>
                            Click Through Rate
                        </span>

                        <h2>
                            32%
                        </h2>

                    </div>


                </div>


            </div>





            <div className="ai-table">



                <div className="ai-head">

                    <span>
                        Product
                    </span>

                    <span>
                        Category
                    </span>

                    <span>
                        Views
                    </span>

                    <span>
                        Clicks
                    </span>

                    <span>
                        Performance
                    </span>

                    <span>
                    </span>

                </div>





                {
                    recommendations.map(item => (


                        <div
                            className="ai-row"
                            key={item.id}
                        >



                            <div className="ai-product">

                                <div className="ai-icon">

                                    <Sparkles size={20} />

                                </div>


                                <div>

                                    <h4>
                                        {item.product}
                                    </h4>

                                    <p>
                                        AI suggested product
                                    </p>

                                </div>


                            </div>





                            <span>
                                {item.category}
                            </span>




                            <span>
                                {item.views}
                            </span>



                            <span>
                                {item.clicks}
                            </span>




                            <span
                                className={
                                    item.performance === "High"
                                        ?
                                        "performance high"
                                        :
                                        "performance medium"
                                }
                            >

                                {item.performance}

                            </span>





                            <button className="ai-view">

                                <ExternalLink size={18} />

                            </button>




                        </div>


                    ))

                }




            </div>



        </div>

    )

}


export default AIRecommendation;