import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function HotelsPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/hotels"),
      api.get("/destinations")
    ])
      .then(([hotelRes, destRes]) => {
        setHotels(hotelRes.data);
        setDestinations(destRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHotels = hotels.filter((h) => {
    const matchesDest = selectedDest ? h.destination?._id === selectedDest : true;
    const matchesSearch = search
      ? h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.destination?.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesDest && matchesSearch;
  });

  return (
    <div className="u-container">
      <div className="u-section-head">
        <div>
          <h2>Hotels & Luxury Resorts</h2>
          <p>Find comfortable accommodations with transparent pricing and verified amenities.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: "white", padding: 18, borderRadius: 18, border: "1px solid var(--u-border)", marginBottom: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
          <input
            type="text"
            className="u-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search hotel name or city..."
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

      {/* Hotel Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Loading stays...</div>
      ) : filteredHotels.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 20, border: "1px solid var(--u-border)" }}>
          <Icon name="hotel" size={48} style={{ color: "#94a3b8", marginBottom: 12 }} />
          <h3>No hotels match your filters</h3>
          <p style={{ color: "#64748b", marginTop: 6 }}>Try selecting another destination or clearing your search.</p>
        </div>
      ) : (
        <div className="u-grid">
          {filteredHotels.map((h) => (
            <div key={h._id} className="u-card">
              <div className="u-card-media">
                <img src={h.image} alt={h.name} />
                <div
                  className="u-card-badge"
                  style={{ background: h.availableRooms < 5 ? "#ef4444" : "#0284c7" }}
                >
                  {h.availableRooms} rooms left
                </div>
              </div>
              <div className="u-card-body">
                <h3>{h.name}</h3>
                <div className="u-card-location">
                  <Icon name="map-pin" size={14} />
                  <span>{h.destination?.name || "Featured Location"}</span>
                </div>
                <p className="u-card-desc">{h.description}</p>
                <div className="u-tags-row">
                  {h.facilities?.map((f) => (
                    <span key={f} className="u-tag" style={{ background: "#eff6ff", borderColor: "#bfdbfe", color: "#1d4ed8" }}>
                      ✓ {f}
                    </span>
                  ))}
                </div>
                <div className="u-card-footer">
                  <div className="u-price-tag">
                    <span>Nightly rate</span>
                    <strong>₹{h.pricePerNight}</strong>
                  </div>
                  <button
                    onClick={() => navigate(`/book?type=hotel&id=${h._id}`)}
                    className="u-btn u-btn-primary"
                  >
                    Book Stay
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
