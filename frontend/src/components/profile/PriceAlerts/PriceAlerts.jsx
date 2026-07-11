import "./PriceAlerts.css";
import {
  Bell,
  Mail,
  TrendingDown,
  Package,
  CheckCircle2
} from "lucide-react";

const trackedProducts = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    currentPrice: "₹72,999",
    targetPrice: "₹70,000",
    status: "Tracking"
  },
  {
    id: 2,
    name: "Samsung S25 Ultra",
    currentPrice: "₹88,999",
    targetPrice: "₹90,000",
    status: "Target Reached"
  },
  {
    id: 3,
    name: "Sony WH-1000XM6",
    currentPrice: "₹26,499",
    targetPrice: "₹25,000",
    status: "Tracking"
  }
];

const PriceAlerts = () => {

  return (

    <div className="alerts-section">

      <div className="alerts-header">

        <div>

          <h2>Price Alerts</h2>

          <p>
            Receive email notifications whenever your favourite products
            reach your target price.
          </p>

        </div>

      </div>

      <div className="alert-settings">

        <div className="setting-card">

          <Mail size={22}/>

          <div>

            <h4>Email Notifications</h4>

            <span>Receive alert emails</span>

          </div>

          <label className="switch">

            <input type="checkbox" defaultChecked />

            <span className="slider"></span>

          </label>

        </div>

        <div className="setting-card">

          <Bell size={22}/>

          <div>

            <h4>Price Drop Alerts</h4>

            <span>Notify on every drop</span>

          </div>

          <label className="switch">

            <input type="checkbox" defaultChecked />

            <span className="slider"></span>

          </label>

        </div>

      </div>

      <h3 className="tracking-title">

        Currently Tracking

      </h3>

      <div className="tracking-list">

        {trackedProducts.map(product => (

          <div
            className="tracking-card"
            key={product.id}
          >

            <div className="tracking-left">

              <div className="tracking-icon">

                <Package size={24}/>

              </div>

              <div>

                <h4>{product.name}</h4>

                <span>

                  Current Price

                  <strong>

                    {product.currentPrice}

                  </strong>

                </span>

              </div>

            </div>

            <div className="tracking-middle">

              <TrendingDown size={18}/>

              Target

              <strong>

                {product.targetPrice}

              </strong>

            </div>

            <div
              className={`tracking-status ${
                product.status === "Target Reached"
                  ? "success"
                  : ""
              }`}
            >

              <CheckCircle2 size={18}/>

              {product.status}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default PriceAlerts;