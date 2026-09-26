import React from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./Icons";

export default function AdminLayout({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/destinations")) return "Destinations Management";
    if (path.includes("/hotels")) return "Hotels & Stays Management";
    if (path.includes("/activities")) return "Activities & Tours Management";
    if (path.includes("/bookings")) return "Central Bookings Dispatch";
    if (path.includes("/users")) return "User & Access Directory";
    return "Executive Command & Analytics";
  };

  return (
    <div className="admin-layout">
      {/* Dedicated Admin Left Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">
              <Icon name="shield" size={22} />
            </div>
            <div className="admin-logo-text">
              <h2>TravelEase</h2>
              <span className="admin-badge">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Admin Profile Box */}
        <div className="admin-user-card">
          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="admin-user-info">
            <div className="name" title={user?.name}>{user?.name || "Administrator"}</div>
            <div className="role">● Super Admin</div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="admin-nav">
          <div className="admin-nav-label">Navigation & Control</div>

          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            <Icon name="dashboard" size={18} />
            <span>Dashboard Overview</span>
          </NavLink>

          <NavLink to="/admin/destinations" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            <Icon name="map-pin" size={18} />
            <span>Destinations</span>
          </NavLink>

          <NavLink to="/admin/hotels" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            <Icon name="hotel" size={18} />
            <span>Hotels</span>
          </NavLink>

          <NavLink to="/admin/activities" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            <Icon name="compass" size={18} />
            <span>Activities</span>
          </NavLink>

          <NavLink to="/admin/bookings" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            <Icon name="calendar" size={18} />
            <span>Bookings Central</span>
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
            <Icon name="users" size={18} />
            <span>Users Directory</span>
          </NavLink>
        </nav>

        {/* Bottom Actions */}
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-exit-btn" title="View customer-facing travel portal">
            <Icon name="external-link" size={16} />
            <span>Switch to User View</span>
          </Link>

          <button onClick={handleLogout} className="admin-logout-btn">
            <Icon name="logout" size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Body */}
      <div className="admin-body">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-breadcrumbs">
            <span style={{ color: "#64748b" }}>Admin Hub</span>
            <span style={{ color: "#475569" }}>/</span>
            <strong>{getPageTitle()}</strong>
          </div>

          <div className="admin-top-actions">
            <div className="admin-system-status">
              <span className="status-dot"></span>
              <span>System Online</span>
            </div>

            <Link
              to="/"
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: "0.82rem", padding: "7px 12px" }}
              title="Return to user travel site"
            >
              <Icon name="external-link" size={14} />
              Storefront View
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
