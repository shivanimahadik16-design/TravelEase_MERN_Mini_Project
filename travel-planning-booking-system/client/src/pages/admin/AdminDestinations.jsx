import React, { useEffect, useState } from "react";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    state: "",
    country: "India",
    description: "",
    image: "",
    bestTime: "",
    tags: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDestinations = async () => {
    try {
      const { data } = await api.get("/destinations");
      setDestinations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      state: "",
      country: "India",
      description: "",
      image: "",
      bestTime: "",
      tags: ""
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (dest) => {
    setEditingId(dest._id);
    setForm({
      name: dest.name || "",
      state: dest.state || "",
      country: dest.country || "India",
      description: dest.description || "",
      image: dest.image || "",
      bestTime: dest.bestTime || "",
      tags: Array.isArray(dest.tags) ? dest.tags.join(", ") : ""
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        name: form.name,
        state: form.state,
        country: form.country,
        description: form.description,
        image: form.image,
        bestTime: form.bestTime,
        tags: tagsArray
      };

      if (editingId) {
        await api.put(`/destinations/${editingId}`, payload);
      } else {
        await api.post("/destinations", payload);
      }

      setIsModalOpen(false);
      await loadDestinations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save destination.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove destination "${name}"?`)) return;
    try {
      await api.delete(`/destinations/${id}`);
      await loadDestinations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete destination");
    }
  };

  const filtered = destinations.filter((d) =>
    search
      ? d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.state?.toLowerCase().includes(search.toLowerCase()) ||
        d.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      : true
  );

  return (
    <div>
      <div className="adm-header-row">
        <div>
          <h1>Destinations Management</h1>
          <p>Create, update travel spots, upload cover imagery, and set best seasons</p>
        </div>

        <button onClick={openAddModal} className="adm-btn adm-btn-primary">
          <Icon name="plus" size={16} />
          Add Destination
        </button>
      </div>

      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <div className="adm-search-input">
            <Icon name="search" size={16} style={{ color: "#64748b" }} />
            <input
              type="text"
              placeholder="Search destination, state or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Showing <strong>{filtered.length}</strong> of {destinations.length} destinations
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>State & Country</th>
                <th>Best Season</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    Loading destinations...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    No destinations found. Click "+ Add Destination" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={d.image}
                          alt={d.name}
                          style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
                        />
                        <div>
                          <strong style={{ color: "#f8fafc", display: "block" }}>{d.name}</strong>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", maxWidth: 260, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {d.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: "#cbd5e1" }}>{d.state}</span>
                      <small style={{ color: "#64748b", display: "block" }}>{d.country || "India"}</small>
                    </td>
                    <td>
                      <span className="adm-pill adm-pill-neutral">
                        {d.bestTime || "All Year"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 200 }}>
                        {d.tags?.map((t) => (
                          <span
                            key={t}
                            style={{ background: "#1e293b", color: "#38bdf8", padding: "2px 6px", borderRadius: 4, fontSize: "0.72rem" }}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button
                          onClick={() => openEditModal(d)}
                          className="adm-icon-btn"
                          title="Edit Destination"
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(d._id, d.name)}
                          className="adm-icon-btn danger"
                          title="Delete Destination"
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

      {/* Modal Dialog for Add / Edit */}
      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{editingId ? "Edit Destination" : "Add New Destination"}</h3>
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
                  <label>Destination Name *</label>
                  <input
                    type="text"
                    required
                    className="adm-input"
                    placeholder="e.g. Manali"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label>State / Province *</label>
                  <input
                    type="text"
                    required
                    className="adm-input"
                    placeholder="e.g. Himachal Pradesh"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
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

              {form.image && (
                <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", height: 120 }}>
                  <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="adm-form-group">
                  <label>Best Season / Months</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. October to June"
                    value={form.bestTime}
                    onChange={(e) => setForm({ ...form, bestTime: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label>Tags (Comma separated)</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. mountains, snow, adventure"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label>Description *</label>
                <textarea
                  required
                  className="adm-input"
                  style={{ minHeight: 90, resize: "vertical" }}
                  placeholder="Scenic valley known for cool climate and adventure sports..."
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
                  {saving ? "Saving..." : editingId ? "Update Destination" : "Create Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
