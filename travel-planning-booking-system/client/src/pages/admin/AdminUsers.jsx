import React, { useEffect, useState } from "react";
import api from "../../api";
import { Icon } from "../../components/Icons";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch = search
      ? u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <div className="adm-header-row">
        <div>
          <h1>Users & Access Directory</h1>
          <p>Inspect registered user accounts, administrative privileges, and registration timestamps</p>
        </div>
      </div>

      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
            <div className="adm-search-input">
              <Icon name="search" size={16} style={{ color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="adm-input"
              style={{ width: 160 }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="user">Standard Users</option>
            </select>
          </div>

          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Showing <strong>{filtered.length}</strong> of {users.length} registered accounts
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Email Address</th>
                <th>Role & Access</th>
                <th>Registered Date</th>
                <th>Account ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    Loading user directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#64748b" }}>
                    No users match current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const isAdmin = u.role === "admin";
                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: isAdmin ? "linear-gradient(135deg, #6366f1, #3b82f6)" : "#1e293b",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 14
                            }}
                          >
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <strong style={{ color: "#f8fafc", display: "block" }}>{u.name}</strong>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: "#cbd5e1" }}>{u.email}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            background: isAdmin ? "rgba(99, 102, 241, 0.2)" : "rgba(148, 163, 184, 0.15)",
                            color: isAdmin ? "#818cf8" : "#94a3b8",
                            border: `1px solid ${isAdmin ? "rgba(99, 102, 241, 0.35)" : "rgba(148, 163, 184, 0.2)"}`,
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase"
                          }}
                        >
                          {isAdmin ? "🛡️ Super Admin" : "👤 User"}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "#94a3b8" }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Historical"}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: "0.75rem", color: "#64748b" }}>{u._id}</code>
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
