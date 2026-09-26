import React, { useEffect, useState } from "react";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadBookings = async () => {
    try {
      const { data } = await api.get("/bookings/all");
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    setProcessingId(id);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking status");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesType = typeFilter === "all" || b.type === typeFilter;
    const itemName = (b.type === "hotel" ? b.hotel?.name : b.activity?.name) || "";
    const customerName = b.user?.name || "";
    const customerEmail = b.user?.email || "";

    const matchesSearch = search
      ? itemName.toLowerCase().includes(search.toLowerCase()) ||
        customerName.toLowerCase().includes(search.toLowerCase()) ||
        customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        b._id.includes(search)
      : true;

    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div>
      <div className="adm-header-row">
        <div>
          <h1>Central Bookings Dispatch</h1>
          <p>Review customer reservations, oversee booking statuses, and manage cancellations</p>
        </div>
      </div>

      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
            <div className="adm-search-input">
              <Icon name="search" size={16} style={{ color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search customer, item or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="adm-input"
              style={{ width: 160 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="adm-input"
              style={{ width: 160 }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="hotel">Hotels Only</option>
              <option value="activity">Activities Only</option>
            </select>
          </div>

          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Showing <strong>{filtered.length}</strong> of {bookings.length} reservations
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Type</th>
                <th>Reserved Property / Tour</th>
                <th>Travel Date</th>
                <th>Party Size</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    Loading platform bookings...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const isHotel = b.type === "hotel";
                  const item = isHotel ? b.hotel : b.activity;
                  const isConfirmed = b.status === "confirmed";

                  return (
                    <tr key={b._id}>
                      <td>
                        <strong style={{ color: "#f8fafc", display: "block" }}>{b.user?.name || "Customer"}</strong>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.user?.email || "No email"}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            background: isHotel ? "rgba(14, 165, 233, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: isHotel ? "#38bdf8" : "#fbbf24",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase"
                          }}
                        >
                          {b.type}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "#cbd5e1" }}>{item?.name || "Unassigned"}</strong>
                        <small style={{ color: "#64748b", display: "block", fontSize: "0.72rem" }}>
                          ID: {b._id.slice(-8)}
                        </small>
                      </td>
                      <td>
                        <span style={{ color: "#cbd5e1" }}>{new Date(b.travelDate).toLocaleDateString()}</span>
                      </td>
                      <td>
                        <span style={{ color: "#cbd5e1" }}>{b.guests} {isHotel ? "Rooms" : "Persons"}</span>
                      </td>
                      <td>
                        <strong style={{ color: "#38bdf8" }}>₹{b.amount}</strong>
                      </td>
                      <td>
                        <span className={`adm-pill ${isConfirmed ? "adm-pill-success" : "adm-pill-danger"}`}>
                          ● {b.status}
                        </span>
                      </td>
                      <td>
                        <div className="adm-table-actions">
                          {isConfirmed ? (
                            <button
                              onClick={() => handleCancel(b._id)}
                              disabled={processingId === b._id}
                              className="adm-btn adm-btn-danger"
                              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                            >
                              {processingId === b._id ? "..." : "Cancel"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusUpdate(b._id, "confirmed")}
                              disabled={processingId === b._id}
                              className="adm-btn adm-btn-primary"
                              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                            >
                              {processingId === b._id ? "..." : "Reconfirm"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
