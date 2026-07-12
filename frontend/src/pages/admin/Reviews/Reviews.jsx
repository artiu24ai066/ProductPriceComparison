import "./Reviews.css";
import {
    Star,
    ExternalLink,
    RefreshCcw
} from "lucide-react";


const reviews = [

    {
        id:1,
        product:"iPhone 16 Pro",
        store:"Amazon",
        rating:"4.7",
        total:"24,560",
        sync:"5 min ago",
        status:"Synced"
    },

    {
        id:2,
        product:"MacBook Air M4",
        store:"Flipkart",
        rating:"4.6",
        total:"18,230",
        sync:"12 min ago",
        status:"Synced"
    },

    {
        id:3,
        product:"Sony WH-1000XM6",
        store:"Croma",
        rating:"4.5",
        total:"8,540",
        sync:"30 min ago",
        status:"Pending"
    },

    {
        id:4,
        product:"Galaxy Watch 7",
        store:"Reliance Digital",
        rating:"4.4",
        total:"6,820",
        sync:"1 hour ago",
        status:"Synced"
    }

];



const Reviews = () => {


return (

<div className="reviews-page">


<div className="reviews-header">

<div>

<h1>
Reviews
</h1>

<p>
Manage product reviews collected from comparison sources.
</p>

</div>


</div>




<div className="reviews-table">



<div className="reviews-head">

<span>
Product
</span>

<span>
Store
</span>

<span>
Rating
</span>

<span>
Reviews
</span>

<span>
Last Sync
</span>

<span>
Status
</span>

<span>
</span>


</div>




{
reviews.map(review=>(


<div 
className="reviews-row"
key={review.id}
>



<div className="review-product">

<h4>
{review.product}
</h4>

<p>
User reviews
</p>

</div>




<span>
{review.store}
</span>




<div className="rating">

<Star size={16}/>

{review.rating}

</div>





<span>
{review.total}
</span>




<div className="sync">

<RefreshCcw size={15}/>

{review.sync}

</div>





<span
className={
review.status==="Synced"
?
"review-status synced"
:
"review-status pending"
}
>

{review.status}

</span>




<button className="review-view">

<ExternalLink size={18}/>

</button>



</div>


))

}



</div>




</div>

)

}


export default Reviews;