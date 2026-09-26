import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function DestinationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "hotels", "activities"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/destinations/${id}`),
      api.get("/hotels", { params: { destination: id } }),
      api.get("/activities", { params: { destination: id } })
    ])
      .then(([destRes, hotelRes, actRes]) => {
        setDestination(destRes.data);
        setHotels(hotelRes.data);
        setActivities(actRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="u-container" style={{ textAlign: "center", padding: 80, color: "#64748b" }}>
        Loading destination details...
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="u-container" style={{ textAlign: "center", padding: 80 }}>
        <h2>Destination not found</h2>
        <Link to="/destinations" className="u-btn u-btn-primary" style={{ marginTop: 20 }}>
          Back to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="u-container">
      {/* Destination Hero Banner */}
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 380, marginBottom: 30, boxShadow: "var(--u-shadow-md)" }}>
        <img
          src={destination.image}
          alt={destination.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 50%, transparent 100%)" }} />

        <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, color: "white" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(2, 132, 199, 0.85)", padding: "4px 12px", borderRadius: 99, fontSize: "0.85rem", fontWeight: 700 }}>
              {destination.state}, {destination.country || "India"}
            </span>
            {destination.bestTime && (
              <span style={{ background: "rgba(255, 255, 255, 0.25)", backdropFilter: "blur(6px)", padding: "4px 12px", borderRadius: 99, fontSize: "0.85rem", fontWeight: 600 }}>
                🗓 Best Time: {destination.bestTime}
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: 0 }}>
            {destination.name}
          </h1>
          <p style={{ maxWidth: 750, color: "#e2e8f0", marginTop: 8, fontSize: "1.05rem", lineHeight: 1.5 }}>
            {destination.description}
          </p>
        </div>
      </div>

      {/* Quick Action Bar & Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setActiveTab("all")}
            className={`u-btn ${activeTab === "all" ? "u-btn-primary" : "u-btn-secondary"}`}
          >
            All Options ({hotels.length + activities.length})
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`u-btn ${activeTab === "hotels" ? "u-btn-primary" : "u-btn-secondary"}`}
          >
            Hotels ({hotels.length})
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`u-btn ${activeTab === "activities" ? "u-btn-primary" : "u-btn-secondary"}`}
          >
            Activities ({activities.length})
          </button>
        </div>

        <Link to="/trips" className="u-btn u-btn-outline">
          <Icon name="calendar" size={16} />
          Create Trip Itinerary for {destination.name}
        </Link>
      </div>

      {/* Hotels Section */}
      {(activeTab === "all" || activeTab === "hotels") && (
        <section style={{ marginBottom: 45 }}>
          <div className="u-section-head">
            <div>
              <h2>Hotels in {destination.name}</h2>
              <p>Comfortable stays near major sights</p>
            </div>
          </div>

          {hotels.length === 0 ? (
            <p style={{ color: "#64748b" }}>No hotels listed yet for this destination.</p>
          ) : (
            <div className="u-grid">
              {hotels.map((h) => (
                <div key={h._id} className="u-card">
                  <div className="u-card-media">
                    <img src={h.image} alt={h.name} />
                    <div className="u-card-badge" style={{ background: "#0284c7" }}>
                      {h.availableRooms} rooms available
                    </div>
                  </div>
                  <div className="u-card-body">
                    <h3>{h.name}</h3>
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
        </section>
      )}

      {/* Activities Section */}
      {(activeTab === "all" || activeTab === "activities") && (
        <section style={{ marginBottom: 40 }}>
          <div className="u-section-head">
            <div>
              <h2>Activities & Tours in {destination.name}</h2>
              <p>Top outdoor tours, sports, and sightseeing experiences</p>
            </div>
          </div>

          {activities.length === 0 ? (
            <p style={{ color: "#64748b" }}>No activities listed yet for this destination.</p>
          ) : (
            <div className="u-grid">
              {activities.map((a) => (
                <div key={a._id} className="u-card">
                  <div className="u-card-media">
                    <img src={a.image} alt={a.name} />
                    <div className="u-card-badge" style={{ background: "#10b981" }}>
                      ⏱ {a.duration}
                    </div>
                  </div>
                  <div className="u-card-body">
                    <h3>{a.name}</h3>
                    <p className="u-card-desc">{a.description}</p>
                    <div className="u-card-footer">
                      <div className="u-price-tag">
                        <span>Per Person</span>
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
        </section>
      )}
    </div>
  );
}
