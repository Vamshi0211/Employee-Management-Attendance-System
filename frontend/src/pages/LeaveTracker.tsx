import React, { useEffect, useState } from "react";

const LeaveTracker: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const limits: any = {
    "Sick Leave": 10,
    "Casual Leave": 8,
    "Earned Leave": 12,
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchLeaves = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id) return;

    fetch(`http://localhost:5000/api/leaves/user/${user._id}`)
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchLeaves();
    const interval = setInterval(fetchLeaves, 3000);
    return () => clearInterval(interval);
  }, []);

  const approvedLeaves = leaves.filter((l) => l.status === "Approved");

  const counts: any = {
    "Sick Leave": 0,
    "Casual Leave": 0,
    "Earned Leave": 0,
  };

  approvedLeaves.forEach((l) => {
    if (counts[l.type] !== undefined) {
      counts[l.type]++;
    }
  });

  const getColumns = () => {
    if (screenWidth < 768) return "1fr";
    if (screenWidth < 1024) return "1fr 1fr";
    return "1fr 1fr 1fr";
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Leave Tracker</h1>
      <p style={styles.subtitle}>Track your leave balance and history.</p>

      {/* CARDS */}
      <div
        style={{
          ...styles.cardRow,
          gridTemplateColumns: getColumns(),
        }}
      >
        {Object.keys(limits).map((type) => {
          const used = counts[type];
          const total = limits[type];
          const percent = (used / total) * 100;

          return (
            <div style={styles.card} key={type}>
              <h3 style={styles.cardTitle}>{type}</h3>

              <div style={styles.cardTop}>
                <h1 style={styles.cardValue}>{used}</h1>
                <span style={styles.cardTotal}>/ {total}</span>
              </div>

              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${percent}%` }} />
              </div>

              <p style={styles.used}>{used} used</p>
            </div>
          );
        })}
      </div>

      {/* TABLE */}
      <div style={styles.historyBox}>
        <h2 style={styles.historyTitle}>Leave History</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={4} style={styles.center}>
                    No leave records
                  </td>
                </tr>
              ) : (
                leaves.map((l, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{l.type}</td>
                    <td style={styles.td}>{l.date}</td>
                    <td style={styles.td}>{l.reason}</td>
                    <td style={styles.td}>
                      <Status
                        label={l.status}
                        color={
                          l.status === "Approved"
                            ? "#22c55e"
                            : l.status === "Rejected"
                            ? "#ef4444"
                            : "#f59e0b"
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveTracker;

const Status = ({ label, color }: any) => (
  <span style={{ ...styles.status, background: color }}>{label}</span>
);

/* ✅ FIXED STYLES */
const styles: any = {
  wrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "16px",
    background: "transparent", // 🔥 FIX
  },

  title: {
    marginTop: "18px",
    fontWeight: "600",
    fontSize: "26px",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "14px",
  },

  cardRow: {
    display: "grid",
    gap: "16px",
    marginTop: "20px",
  },

  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    fontSize: "15px",
    marginBottom: "10px",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  cardValue: {
    margin: 0,
    fontSize: "24px",
  },

  cardTotal: {
    color: "#6b7280",
    fontSize: "13px",
  },

  progressBar: {
    height: "6px",
    background: "#e5e7eb",
    borderRadius: "10px",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    background: "#4f7cff",
    borderRadius: "10px",
  },

  used: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "6px",
  },

  historyBox: {
    background: "#fff",
    padding: "16px",
    borderRadius: "14px",
    marginTop: "20px",
  },

  historyTitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "13px",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
  },

  status: {
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    display: "inline-block",
    minWidth: "80px",
    textAlign: "center",
  },

  center: {
    textAlign: "center",
    padding: "20px",
  },
};