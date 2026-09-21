import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  PartyPopper,
  Info,
  Megaphone,
} from "lucide-react";

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notices");
      const data = await res.json();

      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setNotices(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Notices & Announcements</h1>
      <p style={styles.subtitle}>
        Stay updated with the latest company announcements.
      </p>

      <div style={styles.list}>
        {loading ? (
          <p>Loading...</p>
        ) : notices.length === 0 ? (
          <p>No notices available</p>
        ) : (
          notices.map((n) => {
            const type = n.type || "general"; // ✅ safe
            const config = getNoticeConfig(type);

            return (
              <NoticeCard
                key={n._id}
                title={n.title}
                desc={n.description}
                date={new Date(n.date).toDateString()}
                tag={type}
                config={config}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notices;

/* CARD */
const NoticeCard = ({ title, desc, date, tag, config }: any) => {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconBox, background: config.bg }}>
        {config.icon}
      </div>

      <div style={styles.content}>
        <div style={styles.row}>
          <h3 style={styles.cardTitle}>{title}</h3>

          <span
            style={{
              ...styles.badge,
              background: config.color,
              color: config.textColor,
            }}
          >
            {tag.toLowerCase()}
          </span>
        </div>

        <p style={styles.desc}>{desc}</p>
        <p style={styles.date}>{date}</p>
      </div>
    </div>
  );
};

/* TYPE CONFIG */
const getNoticeConfig = (type: string) => {
  switch (type) {
    case "important":
      return {
        color: "#ef4444",
        bg: "#fee2e2",
        textColor: "#fff",
        icon: <AlertTriangle color="#ef4444" size={18} />,
      };

    case "event":
      return {
        color: "#22c55e",
        bg: "#dcfce7",
        textColor: "#fff",
        icon: <PartyPopper color="#22c55e" size={18} />,
      };

    case "info":
      return {
        color: "#3b82f6",
        bg: "#dbeafe",
        textColor: "#fff",
        icon: <Info color="#3b82f6" size={18} />,
      };

    default:
      return {
        color: "#e5e7eb",
        bg: "#f3f4f6",
        textColor: "#374151",
        icon: <Megaphone color="#6b7280" size={18} />,
      };
  }
};

/* STYLES */
const styles: any = {
  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "16px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
  },

  subtitle: {
    color: "#6b7280",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "20px",
  },

  card: {
    display: "flex",
    gap: "14px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    alignItems: "flex-start",
    flexWrap: "nowrap",
  },

  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "6px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "500",
    textTransform: "lowercase",
    whiteSpace: "nowrap",
  },

  desc: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "14px",
  },

  date: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#9ca3af",
  },
};