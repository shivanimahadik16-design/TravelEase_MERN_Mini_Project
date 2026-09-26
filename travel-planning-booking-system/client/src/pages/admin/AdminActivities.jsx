import React, { useEffect, useState } from "react";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [destFilter, setDestFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    destination: "",
    description: "",
    image: "",
    price: "",
    duration: "4 hours"
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [actRes, destRes] = await Promise.all([
        api.get("/activities"),
        api.get("/destinations")
      ]);
      setActivities(actRes.data);
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

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      destination: destinations[0]?._id || "",
      description: "",
      image: "",
      price: "",
      duration: "4 hours"
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingId(a._id);
    setForm({
      name: a.name || "",
      destination: a.destination?._id || a.destination || "",
      description: a.description || "",
      image: a.image || "",
      price: a.price || "",
      duration: a.duration || "4 hours"
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        destination: form.destination,
        description: form.description,
        image: form.image,
        price: Number(form.price),
        duration: form.duration
      };

      if (editingId) {
        await api.put(`/activities/${editingId}`, payload);
      } else {
        await api.post("/activities", payload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save activity.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete activity "${name}"?`)) return;
    try {
      await api.delete(`/activities/${id}`);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete activity");
    }
  };

  const filtered = activities.filter((a) => {
    const matchesDest = destFilter ? (a.destination?._id || a.destination) === destFilter : true;
    const matchesSearch = search
      ? a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.destination?.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesDest && matchesSearch;
  });

  return (
    <div>
      <div className="adm-header-row">
        <div>
          <h1>Activities & Tours Management</h1>
          <p>Create outdoor excursions, sports events, cultural walking tours, and ticket rates</p>
        </div>

        <button onClick={openAddModal} className="adm-btn adm-btn-primary">
          <Icon name="plus" size={16} />
          Add Activity
        </button>
      </div>

      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
            <div className="adm-search-input">
              <Icon name="search" size={16} style={{ color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search activity name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="adm-input"
              style={{ width: 220 }}
              value={destFilter}
              onChange={(e) => setDestFilter(e.target.value)}
            >
              <option value="">All Destinations</option>
              {destinations.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Showing <strong>{filtered.length}</strong> of {activities.length} activities
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Price / Person</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    Loading activities...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    No activities found. Click "+ Add Activity" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={a.image}
                          alt={a.name}
                          style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
                        />
                        <div>
                          <strong style={{ color: "#f8fafc", display: "block" }}>{a.name}</strong>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", maxWidth: 240, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {a.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: "#cbd5e1" }}>{a.destination?.name || "Unassigned"}</span>
                    </td>
                    <td>
                      <span className="adm-pill adm-pill-neutral">
                        ⏱ {a.duration}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "#38bdf8" }}>₹{a.price}</strong>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button
                          onClick={() => openEditModal(a)}
                          className="adm-icon-btn"
                          title="Edit Activity"
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id, a.name)}
                          className="adm-icon-btn danger"
                          title="Delete Activity"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{editingId ? "Edit Activity" : "Add New Activity"}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: "#94a3b8" }}>
                <Icon name="x" size={20} />
              </button>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", borderRadius: 8, marginBottom: 16, fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="adm-form-group">
                  <label>Activity Name *</label>
                  <input
                    type="text"
                    required
                    className="adm-input"
                    placeholder="e.g. Scuba Diving Expedition"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label>Destination *</label>
                  <select
                    required
                    className="adm-input"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>{d.name} ({d.state})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="adm-form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  required
                  className="adm-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="adm-form-group">
                  <label>Price Per Person (₹) *</label>
                  <input
                    type="number"
                    min="50"
                    required
                    className="adm-input"
                    placeholder="e.g. 1500"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    required
                    className="adm-input"
                    placeholder="e.g. 3 hours, Full Day"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label>Description *</label>
                <textarea
                  required
                  className="adm-input"
                  style={{ minHeight: 90, resize: "vertical" }}
                  placeholder="Detailed tour description, meeting points, safety equipment..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="adm-modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="adm-btn adm-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="adm-btn adm-btn-primary"
                >
                  {saving ? "Saving..." : editingId ? "Update Activity" : "Add Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
