import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const type = params.get("type"); // "hotel" or "activity"
  const id = params.get("id");

  const [item, setItem] = useState(null);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successBooking, setSuccessBooking] = useState(null);

  useEffect(() => {
    if (!type || !id) return;
    setLoading(true);
    api.get(`/${type === "hotel" ? "hotels" : "activities"}/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => {
        // Fallback to list search if single fetch fails
        api.get(`/${type === "hotel" ? "hotels" : "activities"}`)
          .then((r) => setItem(r.data.find((x) => x._id === id)))
          .catch((e) => setError("Could not find booking item details"));
      })
      .finally(() => setLoading(false));
  }, [type, id]);

  const unitPrice = type === "hotel" ? item?.pricePerNight : item?.price;
  const totalAmount = unitPrice ? unitPrice * guests : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        type,
        [type]: id,
        travelDate: date,
        guests: Number(guests)
      };
      const { data } = await api.post("/bookings", payload);
      setSuccessBooking(data);
    } catch (err) {
      setError(err.response?.data?.message || "Booking reservation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!type || !id) {
    return (
      <div className="u-container" style={{ textAlign: "center", padding: 60 }}>
        <h2>Invalid Booking Request</h2>
        <p style={{ color: "#64748b", margin: "10px 0 20px" }}>Please select a hotel or activity first.</p>
        <Link to="/destinations" className="u-btn u-btn-primary">Browse Destinations</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="u-container" style={{ textAlign: "center", padding: 80, color: "#64748b" }}>
        Loading booking details...
      </div>
    );
  }

  if (successBooking) {
    return (
      <div className="u-container" style={{ maxWidth: 600 }}>
        <div className="u-form-card" style={{ textAlign: "center", padding: "40px 30px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <Icon name="check" size={32} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "#15803d", marginBottom: 8 }}>Booking Confirmed!</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            Your reservation for <strong>{item?.name}</strong> has been successfully registered.
          </p>

          <div style={{ background: "#f8fafc", border: "1px solid var(--u-border)", borderRadius: 16, padding: 20, textAlign: "left", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#64748b" }}>Booking Type:</span>
              <strong style={{ textTransform: "capitalize" }}>{type}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#64748b" }}>Travel / Check-in Date:</span>
              <strong>{new Date(date).toLocaleDateString()}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#64748b" }}>Number of {type === "hotel" ? "Rooms/Guests" : "Participants"}:</span>
              <strong>{guests}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e2e8f0" }}>
              <span style={{ fontWeight: 700 }}>Total Paid / Reserved:</span>
              <strong style={{ fontSize: "1.2rem", color: "#0284c7" }}>₹{totalAmount}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/bookings" className="u-btn u-btn-primary">
              View In My Bookings
            </Link>
            <Link to="/" className="u-btn u-btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="u-container" style={{ maxWidth: 840 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 30, alignItems: "start" }}>
        {/* Item Preview Card */}
        <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--u-border)", overflow: "hidden", boxShadow: "var(--u-shadow-sm)" }}>
          <img src={item?.image} alt={item?.name} style={{ width: "100%", height: 220, objectFit: "cover" }} />
          <div style={{ padding: 22 }}>
            <div style={{ display: "inline-block", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "3px 9px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
              {type === "hotel" ? "Hotel & Stay" : "Activity & Tour"}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", marginBottom: 6 }}>{item?.name}</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: 16 }}>{item?.description}</p>

            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.9rem" }}>
                <span style={{ color: "#64748b" }}>Rate:</span>
                <strong>₹{unitPrice} {type === "hotel" ? "/ night" : "/ person"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.9rem" }}>
                <span style={{ color: "#64748b" }}>Guests / Units:</span>
                <strong>x {guests}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #e2e8f0", fontSize: "1.05rem" }}>
                <strong>Estimated Total:</strong>
                <strong style={{ color: "#0284c7" }}>₹{totalAmount}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="u-form-card" style={{ margin: 0, padding: 28 }}>
          <div className="u-form-head" style={{ textAlign: "left", marginBottom: 20 }}>
            <h2>Confirm Reservation</h2>
            <p>Select your preferred dates and travel party size</p>
          </div>

          {error && (
            <div style={{ padding: 12, borderRadius: 10, background: "#fee2e2", color: "#991b1b", marginBottom: 16, fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="u-form-group">
              <label>Travel Date / Check-in</label>
              <input
                type="date"
                required
                className="u-input"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="u-form-group">
              <label>Number of Guests</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  className="u-input"
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>

            <div style={{ margin: "24px 0 16px" }}>
              <button
                type="submit"
                disabled={submitting}
                className="u-btn u-btn-primary"
                style={{ width: "100%", padding: 14, fontSize: "1rem" }}
              >
                {submitting ? "Confirming Reservation..." : `Confirm Booking • ₹${totalAmount}`}
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#94a3b8" }}>
              Instant mock checkout · No cancellation fees up to 24 hours prior.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
