import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/activities"),
      api.get("/destinations")
    ])
      .then(([actRes, destRes]) => {
        setActivities(actRes.data);
        setDestinations(destRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredActivities = activities.filter((a) => {
    const matchesDest = selectedDest ? a.destination?._id === selectedDest : true;
    const matchesSearch = search
      ? a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.destination?.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesDest && matchesSearch;
  });

  return (
    <div className="u-container">
      <div className="u-section-head">
        <div>
          <h2>Outdoor Activities & Sightseeing Tours</h2>
          <p>Exciting adventures, guided city explorations, water sports, and local experiences.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: "white", padding: 18, borderRadius: 18, border: "1px solid var(--u-border)", marginBottom: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
          <input
            type="text"
            className="u-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search activity name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ position: "absolute", left: 14, top: 12, color: "#94a3b8" }}>
            <Icon name="search" size={18} />
          </div>
        </div>

        <div style={{ width: 240 }}>
          <select
            className="u-input"
            value={selectedDest}
            onChange={(e) => setSelectedDest(e.target.value)}
          >
            <option value="">All Destinations</option>
            {destinations.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {(search || selectedDest) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedDest("");
            }}
            className="u-btn u-btn-secondary"
          >
            Reset
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Loading experiences...</div>
      ) : filteredActivities.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 20, border: "1px solid var(--u-border)" }}>
          <Icon name="compass" size={48} style={{ color: "#94a3b8", marginBottom: 12 }} />
          <h3>No activities match your filters</h3>
          <p style={{ color: "#64748b", marginTop: 6 }}>Try selecting another destination or changing search keywords.</p>
        </div>
      ) : (
        <div className="u-grid">
          {filteredActivities.map((a) => (
            <div key={a._id} className="u-card">
              <div className="u-card-media">
                <img src={a.image} alt={a.name} />
                <div className="u-card-badge" style={{ background: "#10b981" }}>
                  ⏱ {a.duration}
                </div>
              </div>
              <div className="u-card-body">
                <h3>{a.name}</h3>
                <div className="u-card-location">
                  <Icon name="map-pin" size={14} />
                  <span>{a.destination?.name || "Featured Activity"}</span>
                </div>
                <p className="u-card-desc">{a.description}</p>
                <div className="u-card-footer">
                  <div className="u-price-tag">
                    <span>Per person</span>
                    <strong>₹{a.price}</strong>
                  </div>
                  <button
                    onClick={() => navigate(`/book?type=activity&id=${a._id}`)}
                    className="u-btn u-btn-primary"
                  >
                    Book Activity
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
