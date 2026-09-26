import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icons";

export default function UserFooter() {
  return (
    <footer className="user-footer">
      <div className="user-footer-content">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div className="brand-icon-box" style={{ width: 32, height: 32 }}>
              <Icon name="plane" size={18} />
            </div>
            <strong style={{ fontSize: "1.2rem", color: "white" }}>TravelEase</strong>
          </div>
          <p style={{ maxWidth: 380, fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6 }}>
            Curate bespoke journeys, explore stunning destinations, book verified hotels and authentic activities worldwide.
          </p>
        </div>

        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          <div>
            <h4 style={{ color: "white", fontSize: "0.92rem", marginBottom: 12 }}>Explore</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.88rem" }}>
              <Link to="/destinations" style={{ color: "#94a3b8" }}>Destinations</Link>
              <Link to="/hotels" style={{ color: "#94a3b8" }}>Hotels & Resorts</Link>
              <Link to="/activities" style={{ color: "#94a3b8" }}>Outdoor Activities</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: "white", fontSize: "0.92rem", marginBottom: 12 }}>Your Trips</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.88rem" }}>
              <Link to="/trips" style={{ color: "#94a3b8" }}>Itinerary Planner</Link>
              <Link to="/bookings" style={{ color: "#94a3b8" }}>Manage Bookings</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="user-footer-copy">
        © {new Date().getFullYear()} TravelEase · MERN Travel Planning and Booking System.
      </div>
    </footer>
  );
}
