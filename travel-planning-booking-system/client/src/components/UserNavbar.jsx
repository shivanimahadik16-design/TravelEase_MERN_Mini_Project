import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "./Icons";

export default function UserNavbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <header className="user-nav">
      <Link to="/" className="user-brand">
        <div className="brand-icon-box">
          <Icon name="plane" size={22} />
        </div>
        <span>TravelEase</span>
      </Link>

      <nav className="user-nav-links">
        <NavLink to="/destinations">Destinations</NavLink>
        <NavLink to="/hotels">Hotels</NavLink>
        <NavLink to="/activities">Activities</NavLink>
        {user && <NavLink to="/trips">Itinerary Planner</NavLink>}
        {user && <NavLink to="/bookings">My Bookings</NavLink>}
        {user && <NavLink to="/account/password">Change Password</NavLink>}
      </nav>

      <div className="user-nav-actions">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" className="u-btn u-btn-secondary" title="Open the administrator dashboard">
                <Icon name="shield" size={16} />
                Admin Dashboard
              </Link>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#0284c7",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#334155" }}>
                {user.name?.split(" ")[0]}
              </span>
            </div>

            <button onClick={handleLogout} className="u-btn u-btn-secondary" style={{ padding: "8px 14px" }}>
              <Icon name="logout" size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="u-btn u-btn-secondary">
              Login
            </Link>
            <Link to="/register" className="u-btn u-btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
