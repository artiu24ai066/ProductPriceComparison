import "./SearchHistory.css";
import {
  Search,
  Clock3,
  ExternalLink,
  Trash2
} from "lucide-react";

const history = [
  {
    id: 1,
    day: "Today",
    items: [
      {
        product: "iPhone 16 Pro",
        time: "10:42 AM",
        category: "Mobile Phones"
      },
      {
        product: "Apple Watch Ultra 2",
        time: "09:15 AM",
        category: "Smart Watches"
      }
    ]
  },
  {
    id: 2,
    day: "Yesterday",
    items: [
      {
        product: "Samsung Galaxy S25 Ultra",
        time: "7:30 PM",
        category: "Mobile Phones"
      },
      {
        product: "Sony WH-1000XM6",
        time: "4:10 PM",
        category: "Headphones"
      }
    ]
  }
];

const SearchHistory = () => {

  return (

    <div className="history-section">

      <div className="history-header">

        <div>

          <h2>Search History</h2>

          <p>
            Quickly revisit products you've searched recently.
          </p>

        </div>

        <button className="clear-history-btn">

          <Trash2 size={18}/>

          Clear History

        </button>

      </div>

      {history.map((group) => (

        <div
          className="history-group"
          key={group.id}
        >

          <div className="history-day">

            {group.day}

          </div>

          {group.items.map((item, index) => (

            <div
              className="history-card"
              key={index}
            >

              <div className="history-icon">

                <Search size={20}/>

              </div>

              <div className="history-info">

                <h3>{item.product}</h3>

                <span>{item.category}</span>

              </div>

              <div className="history-time">

                <Clock3 size={16}/>

                {item.time}

              </div>

              <button className="history-view">

                <ExternalLink size={18}/>

              </button>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

};

export default SearchHistory;