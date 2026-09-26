import React, { useEffect, useState } from "react";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    itinerary: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [tripsRes, destRes] = await Promise.all([
        api.get("/trips/mine"),
        api.get("/destinations")
      ]);
      setTrips(tripsRes.data);
      setDestinations(destRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const lines = form.itinerary
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean)
        .map((details, i) => ({
          day: i + 1,
          title: `Day ${i + 1}`,
          details
        }));

      await api.post("/trips", {
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        itinerary: lines
      });

      setForm({ destination: "", startDate: "", endDate: "", itinerary: "" });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create trip itinerary");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="u-container">
      <div className="u-section-head">
        <div>
          <h2>Smart Itinerary Planner</h2>
          <p>Organize custom travel schedules, daily activities, and stay on track during your holidays.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 32, alignItems: "start" }}>
        {/* Itinerary Creation Form */}
        <div style={{ background: "white", padding: 28, borderRadius: 20, border: "1px solid var(--u-border)", boxShadow: "var(--u-shadow-sm)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 16 }}>
            Create New Trip
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="u-form-group">
              <label>Select Destination</label>
              <select
                required
                className="u-input"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              >
                <option value="">Choose a destination...</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="u-form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  required
                  className="u-input"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div className="u-form-group">
                <label>End Date</label>
                <input
                  type="date"
                  required
                  className="u-input"
                  min={form.startDate}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="u-form-group">
              <label>Daily Itinerary (One activity / milestone per line)</label>
              <textarea
                className="u-input"
                style={{ minHeight: 120, resize: "vertical" }}
                placeholder="Day 1: Arrive and check into beach resort&#10;Day 2: Morning watersports at Baga & evening seafood tour&#10;Day 3: Visit historical fort & sunset cruise"
                value={form.itinerary}
                onChange={(e) => setForm({ ...form, itinerary: e.target.value })}
              />
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                Each line will be automatically converted into a structured Day badge.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="u-btn u-btn-primary"
              style={{ width: "100%", padding: 12, marginTop: 8 }}
            >
              <Icon name="plus" size={16} />
              {submitting ? "Saving Itinerary..." : "Save Trip Itinerary"}
            </button>
          </form>
        </div>

        {/* Existing Saved Trips */}
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 16 }}>
            Your Saved Journeys ({trips.length})
          </h3>

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading your planned trips...</p>
          ) : trips.length === 0 ? (
            <div style={{ background: "white", padding: 40, borderRadius: 20, textAlign: "center", border: "1px solid var(--u-border)" }}>
              <Icon name="compass" size={40} style={{ color: "#94a3b8", marginBottom: 10 }} />
              <h4 style={{ color: "#0f172a" }}>No trips planned yet</h4>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: 4 }}>
                Use the planner on the left to organize your first customized itinerary!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {trips.map((t) => (
                <div key={t._id} className="timeline-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: 14 }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0284c7", background: "#e0f2fe", padding: "3px 9px", borderRadius: 6, textTransform: "uppercase" }}>
                        Itinerary
                      </span>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#0f172a", marginTop: 6 }}>
                        {t.destination?.name || "Trip"}
                      </h4>
                    </div>

                    <div style={{ fontSize: "0.82rem", color: "#64748b", textAlign: "right" }}>
                      <span>🗓 {new Date(t.startDate).toLocaleDateString()}</span>
                      <span style={{ margin: "0 6px" }}>→</span>
                      <span>{new Date(t.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="timeline-list">
                    {t.itinerary?.length > 0 ? (
                      t.itinerary.map((item) => (
                        <div key={item.day} className="timeline-step">
                          <span className="timeline-step-badge">Day {item.day}</span>
                          <span style={{ fontSize: "0.92rem", color: "#334155", lineHeight: 1.5 }}>
                            {item.details}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No daily breakdown added.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
