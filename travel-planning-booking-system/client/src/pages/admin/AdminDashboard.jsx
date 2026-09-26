import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: "#94a3b8", padding: 40 }}>Loading administrative analytics...</div>;
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      sub: "From confirmed bookings",
      icon: "dollar",
      bg: "rgba(16, 185, 129, 0.15)",
      color: "#10b981"
    },
    {
      title: "All Bookings",
      value: stats?.bookings || 0,
      sub: "Registered reservations",
      icon: "calendar",
      bg: "rgba(99, 102, 241, 0.15)",
      color: "#818cf8"
    },
    {
      title: "Destinations",
      value: stats?.destinations || 0,
      sub: "Active travel spots",
      icon: "map-pin",
      bg: "rgba(6, 182, 212, 0.15)",
      color: "#06b6d4"
    },
    {
      title: "Hotels & Stays",
      value: stats?.hotels || 0,
      sub: "Listed properties",
      icon: "hotel",
      bg: "rgba(245, 158, 11, 0.15)",
      color: "#f59e0b"
    },
    {
      title: "Activities & Tours",
      value: stats?.activities || 0,
      sub: "Outdoor experiences",
      icon: "compass",
      bg: "rgba(236, 72, 153, 0.15)",
      color: "#ec4899"
    },
    {
      title: "Registered Users",
      value: stats?.users || 0,
      sub: "Customer accounts",
      icon: "users",
      bg: "rgba(59, 130, 246, 0.15)",
      color: "#3b82f6"
    }
  ];

  return (
    <div>
      {/* Title & Quick Actions */}
      <div className="adm-header-row">
        <div>
          <h1>Operations Overview</h1>
          <p>Real-time analytics, reservation volumes, and resource inventory</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/admin/destinations" className="adm-btn adm-btn-primary">
            <Icon name="plus" size={16} />
            Manage Inventory
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="adm-stats-grid">
        {statCards.map((c) => (
          <div key={c.title} className="adm-stat-card">
            <div className="adm-stat-info">
              <span>{c.title}</span>
              <strong>{c.value}</strong>
              <div className="adm-stat-sub">
                <Icon name="trending-up" size={13} />
                <span>{c.sub}</span>
              </div>
            </div>
            <div className="adm-stat-icon" style={{ background: c.bg, color: c.color }}>
              <Icon name={c.icon} size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Feed */}
      <div className="adm-table-container" style={{ marginBottom: 30 }}>
        <div className="adm-table-toolbar">
          <div>
            <h3 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>Latest Platform Bookings</h3>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Most recent user transactions</span>
          </div>
          <Link to="/admin/bookings" className="adm-btn adm-btn-secondary" style={{ fontSize: "0.82rem", padding: "6px 14px" }}>
            View All Bookings →
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Type</th>
                <th>Reserved Item</th>
                <th>Travel Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#64748b", padding: 30 }}>
                    No bookings recorded yet.
                  </td>
                </tr>
              ) : (
                stats?.recentBookings?.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <strong style={{ color: "#f8fafc", display: "block" }}>{b.user?.name || "Customer"}</strong>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.user?.email}</span>
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize", fontSize: "0.82rem" }}>{b.type}</span>
                    </td>
                    <td>
                      <strong style={{ color: "#cbd5e1" }}>
                        {b.type === "hotel" ? b.hotel?.name : b.activity?.name || "Item"}
                      </strong>
                    </td>
                    <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                    <td>
                      <strong style={{ color: "#38bdf8" }}>₹{b.amount}</strong>
                    </td>
                    <td>
                      <span className={`adm-pill ${b.status === "confirmed" ? "adm-pill-success" : "adm-pill-danger"}`}>
                        ● {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        <Link to="/admin/destinations" className="adm-stat-card" style={{ textDecoration: "none" }}>
          <div>
            <h4 style={{ color: "#f8fafc", marginBottom: 6 }}>📍 Destinations</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Add, edit images, or manage tags & seasonal advice.</p>
          </div>
        </Link>

        <Link to="/admin/hotels" className="adm-stat-card" style={{ textDecoration: "none" }}>
          <div>
            <h4 style={{ color: "#f8fafc", marginBottom: 6 }}>🏨 Hotels & Stays</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Update nightly rates, room availability, and amenities.</p>
          </div>
        </Link>

        <Link to="/admin/activities" className="adm-stat-card" style={{ textDecoration: "none" }}>
          <div>
            <h4 style={{ color: "#f8fafc", marginBottom: 6 }}>🧗 Outdoor Activities</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Configure excursions, tour durations, and ticket fees.</p>
          </div>
        </Link>

        <Link to="/admin/bookings" className="adm-stat-card" style={{ textDecoration: "none" }}>
          <div>
            <h4 style={{ color: "#f8fafc", marginBottom: 6 }}>📑 Dispatch Central</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Review booking manifests and handle cancellations.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
