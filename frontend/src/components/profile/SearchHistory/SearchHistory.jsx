import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchHistory.css";
import api from "../../../api/axios";
import {
  Search,
  Clock3,
  ExternalLink,
  Trash2
} from "lucide-react";

const SearchHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/search-history");
        setHistory(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load search history", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleDeleteItem = async (historyId) => {
    if (!historyId) return;

    try {
      const response = await api.delete(`/users/search-history/${historyId}`);
      setHistory(response.data?.data || []);
    } catch (error) {
      console.error("Failed to delete search history item", error);
    }
  };

  const handleClearHistory = async () => {
    try {
      const response = await api.delete("/users/search-history");
      setHistory(response.data?.data || []);
    } catch (error) {
      console.error("Failed to clear search history", error);
    }
  };

  const groupedHistory = useMemo(() => {
    const groups = [];

    history.forEach((item) => {
      const date = new Date(item.createdAt);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();
      const label = isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

      let group = groups.find((entry) => entry.day === label);
      if (!group) {
        group = { day: label, items: [] };
        groups.push(group);
      }

      group.items.push({
        id: item._id,
        product: item.query,
        time: date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        category: "Search",
      });
    });

    return groups;
  }, [history]);

  return (

    <div className="history-section">

      <div className="history-header">

        <div>

          <h2>Search History</h2>

          <p>
            Quickly revisit products you've searched recently.
          </p>

        </div>

        <button className="clear-history-btn" onClick={handleClearHistory}>

          <Trash2 size={18}/>

          Clear History

        </button>

      </div>

      {loading && <div className="wishlist-empty">Loading search history...</div>}
      {!loading && groupedHistory.length === 0 && <div className="wishlist-empty">No search history available.</div>}
      {groupedHistory.map((group) => (

        <div
          className="history-group"
          key={group.day}
        >

          <div className="history-day">

            {group.day}

          </div>

          {group.items.map((item, index) => (

            <div
              className="history-card"
              key={item.id || index}
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

              <div className="history-actions">

              <button
                className="history-view"
                onClick={() => navigate(`/search-results?q=${encodeURIComponent(item.product)}`)}
              >

                <ExternalLink size={18}/>

              </button>

              <button
                className="history-delete"
                onClick={() => handleDeleteItem(item.id)}
              >

                <Trash2 size={18}/>

              </button>

              </div>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

};

export default SearchHistory;