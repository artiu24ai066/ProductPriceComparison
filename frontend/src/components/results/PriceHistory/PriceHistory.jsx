import { useMemo, useState } from "react";
import {
  TrendingUp,
  IndianRupee,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./PriceHistory.css";

const TIME_RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
];

const colorPalette = ["#4F46E5", "#0EA5E9", "#16A34A", "#F97316", "#E11D48"];

const buildHistoryPoints = (product) => {
  const history = (product?.priceHistory || []).map((entry) => ({
    timestamp: new Date(entry.recordedAt).setHours(0, 0, 0, 0),
    price: entry.price,
  }));

  if (!history.length) {
    const sellers = product?.sellers || [];
    return sellers.map((seller, index) => ({
      timestamp: Date.now() - (sellers.length - 1 - index) * 24 * 60 * 60 * 1000,
      price: seller.price ?? 0,
      label: seller.website || `Store ${index + 1}`,
    }));
  }

  const grouped = history.reduce((acc, point) => {
    if (!acc[point.timestamp]) acc[point.timestamp] = [];
    acc[point.timestamp].push(point.price);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([timestamp, prices]) => ({
      timestamp: Number(timestamp),
      price: Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
};

const formatGraphData = (products, selectedRange) => {
  const pointsByProduct = products.map((product) => ({
    product,
    points: buildHistoryPoints(product),
  }));

  if (!pointsByProduct.length) return [];

  const rangeStart = Date.now() - selectedRange * 24 * 60 * 60 * 1000;

  const timestamps = Array.from(
    new Set(
      pointsByProduct.flatMap(({ points }) =>
        points
          .filter((point) => point.timestamp >= rangeStart)
          .map((point) => point.timestamp)
      )
    )
  ).sort((a, b) => a - b);

  return timestamps.map((timestamp) => {
    const row = {
      date: new Date(timestamp).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
    };

    pointsByProduct.forEach(({ product, points }, index) => {
      const matched = points.find((entry) => entry.timestamp === timestamp);
      row[`product_${index}`] = matched?.price ?? null;
      row[`label_${index}`] = product.canonicalTitle || product.brand || `Product ${index + 1}`;
    });

    return row;
  });
};

const PriceHistory = ({ products = [], onReset }) => {
  const [selectedRange, setSelectedRange] = useState(30);

  const chartData = useMemo(
    () => formatGraphData(products, selectedRange),
    [products, selectedRange]
  );

  const currentPrice = products.reduce(
    (sum, product) => sum + (product?.priceStats?.lowest ?? product?.sellers?.[0]?.price ?? 0),
    0
  );
  const lowestPrice = products.reduce(
    (sum, product) => sum + (product?.priceStats?.lowest ?? 0),
    0
  );
  const highestPrice = products.reduce(
    (sum, product) => sum + (product?.priceStats?.highest ?? 0),
    0
  );

  const titleText = products.length
    ? `Comparing ${products.length} product${products.length > 1 ? "s" : ""}`
    : "Click Compare on a product to view its price history.";

  return (
    <section className="price-history-section">
      <div className="price-history-header">
        <div>
          <h2>
            <TrendingUp size={28} />
            Price History
          </h2>
          <p>{titleText}</p>
        </div>

        <div className="time-filters">
          {TIME_RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              className={selectedRange === range.days ? "active" : ""}
              onClick={() => setSelectedRange(range.days)}
            >
              {range.label}
            </button>
          ))}
          {products.length ? (
            <button className="reset-button" type="button" onClick={onReset}>
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <div className="price-stats">
        <div className="stat-card current">
          <IndianRupee size={22} />
          <h3>Current Price</h3>
          <span>{Number(currentPrice).toLocaleString("en-IN")}</span>
        </div>

        <div className="stat-card low">
          <ArrowDownCircle size={22} />
          <h3>Lowest</h3>
          <span>{Number(lowestPrice).toLocaleString("en-IN")}</span>
        </div>

        <div className="stat-card high">
          <ArrowUpCircle size={22} />
          <h3>Highest</h3>
          <span>{Number(highestPrice).toLocaleString("en-IN")}</span>
        </div>
      </div>

      {products.length ? (
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fill: "#999" }} />
              <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fill: "#999" }} />
              <Tooltip formatter={(value) => (value !== null ? `₹${value}` : "-")} />
              <Legend verticalAlign="top" height={40} />
              {products.map((product, index) => {
                const productName = product.canonicalTitle || product.brand || `Product ${index + 1}`;
                return (
                  <Line
                    key={`line-${index}`}
                    type="monotone"
                    dataKey={`product_${index}`}
                    name={productName}
                    stroke={colorPalette[index % colorPalette.length]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    connectNulls
                    isAnimationActive={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="graph-placeholder">
          <div className="graph-grid">
            <span>Click Compare on a product to view its price history.</span>
          </div>
        </div>
      )}

      <div className="ai-price-tip">
        <div className="tip-badge">AI Insight</div>
        <p>
          {products.length
            ? "Selected products are shown on the chart above. Use the timeline buttons to narrow the comparison window."
            : "Select one or more products to see price history and compare across timelines."}
        </p>
      </div>
    </section>
  );
};

export default PriceHistory;
