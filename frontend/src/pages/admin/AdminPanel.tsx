import React, { useState, useEffect } from "react";

const AdminPanel: React.FC = () => {
  const [showNotice, setShowNotice] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const [leaves, setLeaves] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("general");

  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/leaves");
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/leaves/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchLeaves();
  };

  const handleCreateNotice = async () => {
    if (!title || !description || !date || !type) {
      return alert("Fill all fields");
    }

    await fetch("http://localhost:5000/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, date, type }),
    });

    setTitle("");
    setDescription("");
    setDate("");
    setType("general");
    setShowNotice(false);
  };

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  return (
    <div style={styles.wrapper}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.subtitle}>Manage leave requests and notices</p>
        </div>

        <button style={styles.primaryBtn} onClick={() => setShowNotice(true)}>
          + Create Notice
        </button>
      </div>

      {/* STATS */}
      <div style={styles.stats}>
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Pending" value={stats.pending} color="#f59e0b" />
        <StatCard title="Approved" value={stats.approved} color="#22c55e" />
        <StatCard title="Rejected" value={stats.rejected} color="#ef4444" />
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <div style={styles.tableHeader}>
          <h3 style={{ margin: 0 }}>Leave Requests</h3>
          <span style={styles.pendingBadge}>{stats.pending} pending</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={styles.center}>Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={5} style={styles.center}>No data</td></tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l._id}>
                    <td style={styles.bold}>{l.name}</td>
                    <td style={styles.light}>{l.type}</td>
                    <td style={styles.light}>{l.date}</td>

                    <td>
                      <span
                        style={{
                          ...styles.status,
                          ...(l.status === "Pending" && styles.pending),
                          ...(l.status === "Approved" && styles.approved),
                          ...(l.status === "Rejected" && styles.rejected),
                        }}
                      >
                        {l.status}
                      </span>
                    </td>

                    <td style={styles.actions}>
                      {/* 👁 VIEW */}
                      <button
                        style={styles.reasonBtn}
                        onClick={() => {
                          setSelectedLeave(l);
                          setShowReason(true);
                        }}
                      >
                        👁
                      </button>

                      <button
                        disabled={l.status !== "Pending"}
                        style={{
                          ...styles.approve,
                          opacity: l.status !== "Pending" ? 0.5 : 1,
                        }}
                        onClick={() => updateStatus(l._id, "Approved")}
                      >
                        Approve
                      </button>

                      <button
                        disabled={l.status !== "Pending"}
                        style={{
                          ...styles.reject,
                          opacity: l.status !== "Pending" ? 0.5 : 1,
                        }}
                        onClick={() => updateStatus(l._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTICE MODAL */}
      {showNotice && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Create Notice</h2>

            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={styles.select}
            >
              <option value="important">Important</option>
              <option value="event">Event</option>
              <option value="info">Info</option>
              <option value="general">General</option>
            </select>

            <div style={styles.modalActions}>
              <button onClick={() => setShowNotice(false)}>Cancel</button>
              <button style={styles.primaryBtn} onClick={handleCreateNotice}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REASON MODAL */}
      {showReason && selectedLeave && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Leave Details</h2>

            <p><b>Name:</b> {selectedLeave.name}</p>
            <p><b>Type:</b> {selectedLeave.type}</p>
            <p><b>Date:</b> {selectedLeave.date}</p>

            <div style={styles.reasonBox}>
              {selectedLeave.reason || "No reason provided"}
            </div>

            <div style={styles.modalActions}>
              <button onClick={() => setShowReason(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color = "#111" }: any) => (
  <div style={styles.statCard}>
    <p style={styles.statTitle}>{title}</p>
    <h2 style={{ color }}>{value}</h2>
  </div>
);

export default AdminPanel;

/* STYLES */
const styles: any = {
  wrapper: { padding: "20px", maxWidth: "1100px", margin: "auto" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },

  title: { fontSize: "24px", fontWeight: 600 },
  subtitle: { color: "#6b7280" },

  primaryBtn: {
    background: "#4f7cff",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
    gap: "14px",
    marginTop: "20px",
  },

  statCard: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #eee",
  },

  statTitle: { fontSize: "13px", color: "#6b7280" },

  card: {
    marginTop: "20px",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #eee",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px",
    borderBottom: "1px solid #eee",
    flexWrap: "wrap",
  },

  pendingBadge: {
    background: "#fef3c7",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  table: { width: "100%", minWidth: "600px" },

  th: { padding: "14px", textAlign: "left" },

  bold: { padding: "14px", fontWeight: "500" },
  light: { padding: "14px", color: "#6b7280" },

  status: { padding: "5px 10px", borderRadius: "20px", fontSize: "12px" },
  pending: { background: "#fef3c7" },
  approved: { background: "#d1fae5" },
  rejected: { background: "#fee2e2" },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "6px",
    padding: "14px",
    flexWrap: "wrap",
  },

  reasonBtn: {
    border: "1px solid #ddd",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  approve: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
  },

  reject: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
  },

  modal: {
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "500px",
    boxSizing: "border-box",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "100px",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  },

  reasonBox: {
    background: "#f3f4f6",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
  },

  center: { textAlign: "center", padding: "20px" },
};