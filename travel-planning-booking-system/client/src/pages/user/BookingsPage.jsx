import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/mine");
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="u-container">
      <div className="u-section-head">
        <div>
          <h2>My Bookings</h2>
          <p>Review and track your reserved hotels, resorts, and outdoor activities.</p>
        </div>
        <Link to="/destinations" className="u-btn u-btn-primary">
          + Book Another Trip
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Loading your reservations...</div>
      ) : bookings.length === 0 ? (
        <div style={{ background: "white", padding: 50, borderRadius: 20, textAlign: "center", border: "1px solid var(--u-border)", boxShadow: "var(--u-shadow-sm)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0f9ff", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="calendar" size={32} />
          </div>
          <h3 style={{ fontSize: "1.3rem", color: "#0f172a" }}>No Bookings Found</h3>
          <p style={{ color: "#64748b", margin: "8px auto 24px", maxWidth: 420 }}>
            You haven't booked any hotel stays or activities yet. Explore our destinations and plan your next journey!
          </p>
          <Link to="/destinations" className="u-btn u-btn-primary">
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {bookings.map((b) => {
            const isHotel = b.type === "hotel";
            const item = isHotel ? b.hotel : b.activity;
            const isConfirmed = b.status === "confirmed";

            return (
              <div
                key={b._id}
                style={{
                  background: "white",
                  borderRadius: 18,
                  border: "1px solid var(--u-border)",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                  boxShadow: "var(--u-shadow-sm)"
                }}
              >
                {/* Left Media & Info */}
                <div style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 280 }}>
                  <img
                    src={item?.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80"}
                    alt={item?.name || "Booking item"}
                    style={{ width: 84, height: 84, borderRadius: 14, objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: isHotel ? "#e0f2fe" : "#fef3c7", color: isHotel ? "#0369a1" : "#92400e", textTransform: "uppercase" }}>
                        {b.type}
                      </span>
                      <span className={`u-status-pill ${isConfirmed ? "u-status-confirmed" : "u-status-cancelled"}`}>
                        ● {b.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.2rem", color: "#0f172a", marginBottom: 6 }}>
                      {item?.name || "Unknown item"}
                    </h3>
                    <div style={{ display: "flex", gap: 14, fontSize: "0.85rem", color: "#64748b" }}>
                      <span>🗓 Date: {new Date(b.travelDate).toLocaleDateString()}</span>
                      <span>👥 {b.guests} {isHotel ? "Rooms" : "Guests"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", display: "block" }}>Total Paid</span>
                    <strong style={{ fontSize: "1.35rem", color: "#0f172a" }}>₹{b.amount}</strong>
                  </div>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      disabled={cancellingId === b._id}
                      className="u-btn u-btn-danger"
                    >
                      {cancellingId === b._id ? "Cancelling..." : "Cancel Reservation"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
