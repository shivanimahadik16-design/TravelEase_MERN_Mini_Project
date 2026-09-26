import React, { useEffect, useState } from "react";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
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
    pricePerNight: "",
    facilities: "",
    availableRooms: 10
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [hotelRes, destRes] = await Promise.all([
        api.get("/hotels"),
        api.get("/destinations")
      ]);
      setHotels(hotelRes.data);
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
      pricePerNight: "",
      facilities: "Wi-Fi, Breakfast, Pool",
      availableRooms: 10
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (h) => {
    setEditingId(h._id);
    setForm({
      name: h.name || "",
      destination: h.destination?._id || h.destination || "",
      description: h.description || "",
      image: h.image || "",
      pricePerNight: h.pricePerNight || "",
      facilities: Array.isArray(h.facilities) ? h.facilities.join(", ") : "",
      availableRooms: h.availableRooms || 0
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const facilitiesArray = form.facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        name: form.name,
        destination: form.destination,
        description: form.description,
        image: form.image,
        pricePerNight: Number(form.pricePerNight),
        facilities: facilitiesArray,
        availableRooms: Number(form.availableRooms)
      };

      if (editingId) {
        await api.put(`/hotels/${editingId}`, payload);
      } else {
        await api.post("/hotels", payload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save hotel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete hotel "${name}"?`)) return;
    try {
      await api.delete(`/hotels/${id}`);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete hotel");
    }
  };

  const filtered = hotels.filter((h) => {
    const matchesDest = destFilter ? (h.destination?._id || h.destination) === destFilter : true;
    const matchesSearch = search
      ? h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.destination?.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesDest && matchesSearch;
  });

  return (
    <div>
      <div className="adm-header-row">
        <div>
          <h1>Hotels & Stays Management</h1>
          <p>Configure room pricing, room availability stocks, and property facilities</p>
        </div>

        <button onClick={openAddModal} className="adm-btn adm-btn-primary">
          <Icon name="plus" size={16} />
          Add Hotel
        </button>
      </div>

      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
            <div className="adm-search-input">
              <Icon name="search" size={16} style={{ color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search hotel name..."
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
            Showing <strong>{filtered.length}</strong> of {hotels.length} hotels
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Destination</th>
                <th>Price / Night</th>
                <th>Available Rooms</th>
                <th>Facilities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    Loading hotels...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    No hotels found. Click "+ Add Hotel" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((h) => (
                  <tr key={h._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={h.image}
                          alt={h.name}
                          style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
                        />
                        <div>
                          <strong style={{ color: "#f8fafc", display: "block" }}>{h.name}</strong>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", maxWidth: 220, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {h.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: "#cbd5e1" }}>{h.destination?.name || "Unassigned"}</span>
                    </td>
                    <td>
                      <strong style={{ color: "#38bdf8" }}>₹{h.pricePerNight}</strong>
                    </td>
                    <td>
                      <span className={`adm-pill ${h.availableRooms < 5 ? "adm-pill-danger" : "adm-pill-success"}`}>
                        {h.availableRooms} rooms left
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 180 }}>
                        {h.facilities?.map((f) => (
                          <span
                            key={f}
                            style={{ background: "#1e293b", color: "#cbd5e1", padding: "2px 6px", borderRadius: 4, fontSize: "0.72rem" }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button
                          onClick={() => openEditModal(h)}
                          className="adm-icon-btn"
                          title="Edit Hotel"
                        >
                          <Icon name="edit" size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(h._id, h.name)}
                          className="adm-icon-btn danger"
                          title="Delete Hotel"
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
              <h3>{editingId ? "Edit Hotel" : "Add New Hotel Property"}</h3>
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
                  <label>Hotel Name *</label>
                  <input
                    type="text"
                    required
                    className="adm-input"
                    placeholder="e.g. Grand Heritage Palace"
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
                <label>Cover Image URL *</label>
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
                  <label>Price Per Night (₹) *</label>
                  <input
                    type="number"
                    min="100"
                    required
                    className="adm-input"
                    placeholder="e.g. 3500"
                    value={form.pricePerNight}
                    onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label>Available Rooms *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="adm-input"
                    placeholder="e.g. 12"
                    value={form.availableRooms}
                    onChange={(e) => setForm({ ...form, availableRooms: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label>Facilities (Comma separated)</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="Wi-Fi, Swimming Pool, Free Breakfast, Spa"
                  value={form.facilities}
                  onChange={(e) => setForm({ ...form, facilities: e.target.value })}
                />
              </div>

              <div className="adm-form-group">
                <label>Description *</label>
                <textarea
                  required
                  className="adm-input"
                  style={{ minHeight: 90, resize: "vertical" }}
                  placeholder="Comfortable boutique resort located 5 minutes from scenic viewpoints..."
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
                  {saving ? "Saving..." : editingId ? "Update Hotel" : "Add Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
