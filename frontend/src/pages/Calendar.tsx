import React, { useState, useEffect } from "react";

const Calendar: React.FC = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState<any>({});
  const [user, setUser] = useState<any>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/attendance/${user._id}`
        );

        const data = await res.json();

        const map: any = {};
        data.forEach((item: any) => {
          map[item.date] = true;
        });

        setAttendanceMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [user]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Attendance Calendar</h1>
      <p style={styles.subtitle}>
        View your monthly attendance record.
      </p>

      <div style={styles.card}>
        <div style={styles.header}>
          <button onClick={handlePrevMonth}>◀</button>
          <h2 style={styles.month}>
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </h2>
          <button onClick={handleNextMonth}>▶</button>
        </div>

        <div style={styles.grid}>
          {days.map((d) => (
            <div key={d} style={styles.dayHeader}>
              {d}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={"empty" + i}></div>
          ))}

          {Array.from({ length: totalDays }, (_, i) => {
            const date = i + 1;

            const fullDate = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(date).padStart(2, "0")}`;

            const today = new Date();
            const currentDay = new Date(year, month, date);

            const isToday =
              date === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const isPast = currentDay <= today;

            const dayOfWeek = currentDay.getDay();
            const isSunday = dayOfWeek === 0;

            const isSaturdayHoliday = false;
            const isSaturday = dayOfWeek === 6;

            const isHoliday = isSunday || (isSaturday && isSaturdayHoliday);

            const isPresent = attendanceMap[fullDate];

            return (
              <div
                key={date}
                style={{
                  ...styles.dateCell,
                  ...(isPresent ? styles.present : {}),
                  ...(!isPresent && isPast && !isHoliday && !isToday
                    ? styles.absent
                    : {}),
                  ...(isHoliday ? styles.holiday : {}),
                  ...(isToday ? styles.activeDate : {}),
                }}
              >
                {date}
              </div>
            );
          })}
        </div>

        <div style={styles.legend}>
          <Legend color="#22c55e" label="Present" />
          <Legend color="#ef4444" label="Absent" />
          <Legend color="#3b82f6" label="Holiday" />
        </div>
      </div>
    </div>
  );
};

export default Calendar;

/* LEGEND */
const Legend = ({ color, label }: any) => (
  <div style={styles.legendItem}>
    <span style={{ ...styles.legendDot, background: color }} />
    {label}
  </div>
);

/* ✅ CLEAN STYLES (NO BACKGROUND LAYER HERE) */
const styles: any = {
  wrapper: {
    maxWidth: "850px",
    margin: "0 auto",
    padding: "16px",
    background: "transparent", // ✅ IMPORTANT FIX
  },

  title: {
    fontSize: "clamp(20px, 4vw, 26px)",
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
    padding: "clamp(14px, 3vw, 20px)",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "8px",
  },

  month: {
    fontSize: "clamp(16px, 3vw, 18px)",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(32px, 1fr))",
    gap: "8px",
  },

  dayHeader: {
    textAlign: "center",
    fontSize: "12px",
    color: "#6b7280",
  },

  dateCell: {
    textAlign: "center",
    padding: "clamp(6px, 2vw, 10px)",
    borderRadius: "10px",
    fontSize: "12px",
  },

  activeDate: {
    border: "2px solid #4f7cff",
    borderRadius: "12px",
  },

  present: {
    background: "#22c55e",
    color: "#fff",
  },

  absent: {
    background: "#ef4444",
    color: "#fff",
  },

  holiday: {
    background: "#3b82f6",
    color: "#fff",
  },

  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "20px",
    borderTop: "1px solid #eee",
    paddingTop: "12px",
    flexWrap: "wrap",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#6b7280",
  },

  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
};