import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProduct = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/products?query=${query}`
      );

      const data = await res.json();
      console.log("API response:", data); // 👈 DEBUG LINE

      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Product Price Comparison</h1>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={searchProduct}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No products found. Try another search.
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        {results.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{item.site}</span>
            <strong>₹{item.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
