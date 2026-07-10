import {
  TrendingUp,
  IndianRupee,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import "./PriceHistory.css";

const PriceHistory = () => {
  return (
    <section className="price-history-section">
      <div className="price-history-header">
        <div>
          <h2>
            <TrendingUp size={28} />
            Price History
          </h2>
          <p>
            Track price changes and find the best time to purchase.
          </p>
        </div>

        <div className="time-filters">
          <button className="active">7D</button>
          <button>30D</button>
          <button>3M</button>
          <button>6M</button>
          <button>1Y</button>
        </div>
      </div>

      <div className="price-stats">

        <div className="stat-card current">
          <IndianRupee size={22} />
          <h3>Current Price</h3>
          <span>₹1,08,999</span>
        </div>

        <div className="stat-card low">
          <ArrowDownCircle size={22} />
          <h3>Lowest</h3>
          <span>₹99,499</span>
        </div>

        <div className="stat-card high">
          <ArrowUpCircle size={22} />
          <h3>Highest</h3>
          <span>₹1,19,999</span>
        </div>

      </div>

      {/* Replace this with Recharts later */}
      <div className="graph-placeholder">
        <div className="graph-grid">
          <span>Interactive Price Graph</span>
        </div>
      </div>

      <div className="ai-price-tip">
        <div className="tip-badge">AI Insight</div>

        <p>
          Current price is
          <strong> 8% lower </strong>
          than the average price over the last 6 months.
          This is considered a
          <span> Good Time to Buy.</span>
        </p>
      </div>
    </section>
  );
};

export default PriceHistory;