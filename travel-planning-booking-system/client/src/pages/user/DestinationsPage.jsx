import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialQuery);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDestinations = async (qString) => {
    setLoading(true);
    try {
      const { data } = await api.get("/destinations", {
        params: qString ? { q: qString } : {}
      });
      setDestinations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
    fetchDestinations(q);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchParams({ q: search.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleTagFilter = (tag) => {
    setSearchParams({ q: tag });
  };

  return (
    <div className="u-container">
      {/* Header */}
      <div className="u-section-head">
        <div>
          <h2>Explore Travel Destinations</h2>
          <p>Discover scenic mountains, sun-drenched beaches, and cultural heritage across regions.</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ background: "white", padding: 18, borderRadius: 18, border: "1px solid var(--u-border)", marginBottom: 30, boxShadow: "var(--u-shadow-sm)" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              className="u-input"
              style={{ paddingLeft: 42 }}
              placeholder="Search by city (e.g. Goa, Manali, Jaipur), state, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ position: "absolute", left: 14, top: 12, color: "#94a3b8" }}>
              <Icon name="search" size={18} />
            </div>
          </div>
          <button type="submit" className="u-btn u-btn-primary">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="u-btn u-btn-secondary"
              onClick={() => {
                setSearch("");
                setSearchParams({});
              }}
            >
              Clear
            </button>
          )}
        </form>

        {/* Quick Tags */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748b" }}>Quick Tags:</span>
          {["beach", "mountains", "adventure", "heritage", "culture", "snow", "food"].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className="u-tag"
              style={{ cursor: "pointer", background: search === tag ? "#0284c7" : "#f1f5f9", color: search === tag ? "white" : "#475569", borderColor: search === tag ? "#0284c7" : "#e2e8f0" }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of destinations */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 50, color: "#64748b" }}>Loading destinations...</div>
      ) : destinations.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 20, border: "1px solid var(--u-border)" }}>
          <Icon name="compass" size={48} style={{ color: "#94a3b8", marginBottom: 12 }} />
          <h3>No destinations found</h3>
          <p style={{ color: "#64748b", marginTop: 6 }}>Try clearing your search or exploring different keywords.</p>
        </div>
      ) : (
        <div className="u-grid">
          {destinations.map((d) => (
            <div key={d._id} className="u-card">
              <div className="u-card-media">
                <img src={d.image} alt={d.name} />
                <div className="u-card-badge">{d.bestTime || "Best time: All Year"}</div>
              </div>
              <div className="u-card-body">
                <h3>{d.name}</h3>
                <div className="u-card-location">
                  <Icon name="map-pin" size={14} />
                  <span>{d.state}, {d.country || "India"}</span>
                </div>
                <p className="u-card-desc">{d.description}</p>
                <div className="u-tags-row">
                  {d.tags?.map((t) => (
                    <span key={t} className="u-tag">#{t}</span>
                  ))}
                </div>
                <div className="u-card-footer">
                  <Link to={`/destinations/${d._id}`} className="u-btn u-btn-primary" style={{ width: "100%" }}>
                    View Hotels & Activities →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
