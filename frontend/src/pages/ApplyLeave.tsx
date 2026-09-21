import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";

const ApplyLeave: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [error, setError] = useState("");
  const [days, setDays] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      if (end < start) {
        setError("To Date cannot be before From Date");
        setDays(0);
      } else {
        setError("");
        const diff =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
        setDays(diff);
      }
    }
  }, [fromDate, toDate]);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!type || !reason || !fromDate || !toDate) {
      setError("Please fill all required fields");
      return;
    }

    if (toDate < fromDate) {
      setError("To Date cannot be before From Date");
      return;
    }

    setError("");

    try {
      await fetch("http://localhost:5000/api/leaves/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          name: user.name,
          type,
          date: fromDate,
          toDate,
          reason,
        }),
      });

      alert("Leave Applied Successfully!");

      setEmail("");
      setSubject("");
      setType("");
      setReason("");
      setFromDate("");
      setToDate("");
      setDays(0);

    } catch (err) {
      console.error(err);
      alert("Error applying leave");
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Apply for Leave</h1>
      <p style={styles.subtitle}>
        Fill in the form to submit a leave request.
      </p>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Leave Application</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>To (Manager Email)</label>
          <input
            type="email"
            placeholder="manager@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Subject</label>
          <input
            type="text"
            placeholder="Leave request for..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Leave Type</label>
          <select
            style={styles.input}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select leave type</option>
            <option>Sick Leave</option>
            <option>Casual Leave</option>
            <option>Paid Leave</option>
          </select>
        </div>

        <div
          style={{
            ...styles.dateRow,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={styles.dateGroup}>
            <label style={styles.label}>From Date</label>
            <input
              type="date"
              value={fromDate}
              min={today}
              onChange={(e) => setFromDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.dateGroup}>
            <label style={styles.label}>To Date</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || today}
              onChange={(e) => setToDate(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {days > 0 && (
          <p style={styles.days}>
            Total Leave Days: <strong>{days}</strong>
          </p>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Message</label>
          <textarea
            placeholder="Describe your reason for leave..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          <Send size={18} />
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default ApplyLeave;

/* ✅ FIXED STYLES */
const styles: any = {
  wrapper: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "16px",
    background: "transparent", // ✅ IMPORTANT FIX
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
  },

  subtitle: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "14px",
  },

  card: {
    marginTop: "20px",
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    marginBottom: "18px",
    fontSize: "18px",
    fontWeight: "600",
  },

  formGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
    fontSize: "14px",
  },

  dateRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "10px",
  },

  dateGroup: {
    flex: 1,
  },

  error: {
    color: "#ef4444",
    fontSize: "13px",
    marginBottom: "8px",
  },

  days: {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "10px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    minHeight: "110px",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
  },

  button: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#4f7cff",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },
};