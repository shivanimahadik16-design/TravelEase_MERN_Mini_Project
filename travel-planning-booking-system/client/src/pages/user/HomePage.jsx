import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/destinations"),
      api.get("/hotels")
    ])
      .then(([destRes, hotelRes]) => {
        setDestinations(destRes.data.slice(0, 3));
        setHotels(hotelRes.data.slice(0, 3));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/destinations?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/destinations");
    }
  };

  const handlePillClick = (tag) => {
    navigate(`/destinations?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="user-hero">
        <div className="user-hero-content">
          <div className="user-hero-tag">
            <Icon name="compass" size={16} />
            <span>Discover The World With TravelEase</span>
          </div>

          <h1>Plan, Explore & Book Your Next Journey</h1>
          <p>
            Experience hand-picked destinations, premium hotels, and exhilarating outdoor adventures with an all-in-one smart travel planner.
          </p>

          {/* Search Box */}
          <form className="user-search-box" onSubmit={handleSearchSubmit}>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px", color: "#64748b" }}>
              <Icon name="search" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by city (e.g. Goa, Manali, Jaipur), state, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="u-btn u-btn-primary" style={{ padding: "12px 24px" }}>
              Find Trips
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="hero-pills">
            {["beach", "mountains", "adventure", "heritage", "culture"].map((tag) => (
              <button key={tag} className="hero-pill" onClick={() => handlePillClick(tag)}>
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="u-container">
        <div className="u-section-head">
          <div>
            <h2>Featured Destinations</h2>
            <p>Popular getaways trending this season</p>
          </div>
          <Link to="/destinations" className="u-btn u-btn-outline">
            View All ({destinations.length}+)
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading destinations...</div>
        ) : (
          <div className="u-grid">
            {destinations.map((d) => (
              <div key={d._id} className="u-card">
                <div className="u-card-media">
                  <img src={d.image} alt={d.name} />
                  <div className="u-card-badge">{d.bestTime || "Year round"}</div>
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
                      Explore Itineraries & Stays
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Hotels */}
      <section className="u-container">
        <div className="u-section-head">
          <div>
            <h2>Handpicked Stays & Resorts</h2>
            <p>Comfortable, verified properties for restful vacations</p>
          </div>
          <Link to="/hotels" className="u-btn u-btn-outline">
            Browse All Hotels
          </Link>
        </div>

        <div className="u-grid">
          {hotels.map((h) => (
            <div key={h._id} className="u-card">
              <div className="u-card-media">
                <img src={h.image} alt={h.name} />
                <div className="u-card-badge" style={{ background: "#0284c7" }}>
                  {h.availableRooms} rooms left
                </div>
              </div>
              <div className="u-card-body">
                <h3>{h.name}</h3>
                <div className="u-card-location">
                  <Icon name="map-pin" size={14} />
                  <span>{h.destination?.name || "Popular Destination"}</span>
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
                    <span>From</span>
                    <strong>₹{h.pricePerNight} <small style={{ fontSize: "0.75rem", fontWeight: 400 }}>/ night</small></strong>
                  </div>
                  <Link to={`/book?type=hotel&id=${h._id}`} className="u-btn u-btn-primary">
                    Book Stay
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="u-container" style={{ marginTop: 60 }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "24px", border: "1px solid var(--u-border)", boxShadow: "var(--u-shadow-sm)" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "#0f172a" }}>
              How TravelEase Simplifies Your Trips
            </h2>
            <p style={{ color: "#64748b", marginTop: 6 }}>Everything you need from inspiration to booking confirmation</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            <div style={{ padding: "20px", borderRadius: "16px", background: "#f8fafc" }}>
              <div className="brand-icon-box" style={{ width: 44, height: 44, marginBottom: 16 }}>
                <Icon name="compass" size={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: 8, color: "#0f172a" }}>1. Explore Destinations</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Filter destinations by themes like beaches, mountains, or historical heritage with best season guidance.
              </p>
            </div>

            <div style={{ padding: "20px", borderRadius: "16px", background: "#f8fafc" }}>
              <div className="brand-icon-box" style={{ width: 44, height: 44, marginBottom: 16, background: "linear-gradient(135deg, #10b981, #059669)" }}>
                <Icon name="calendar" size={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: 8, color: "#0f172a" }}>2. Build Custom Itineraries</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Organize day-by-day travel schedules, sight-seeing milestones, and notes saved directly to your account.
              </p>
            </div>

            <div style={{ padding: "20px", borderRadius: "16px", background: "#f8fafc" }}>
              <div className="brand-icon-box" style={{ width: 44, height: 44, marginBottom: 16, background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <Icon name="hotel" size={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: 8, color: "#0f172a" }}>3. Instant Stays & Activities</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Reserve verified rooms and guided tours with real-time room availability counters and easy booking tracking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
