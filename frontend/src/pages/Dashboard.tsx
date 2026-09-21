import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Coffee,
  Clock,
} from "lucide-react";

const Dashboard: React.FC = () => {

  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const [user, setUser] = useState<any>(null);

  const userName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const hours = new Date().getHours();
  let greeting = "Hello";

  if (hours < 12) greeting = "Good Morning";
  else if (hours < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const [presentDays, setPresentDays] = useState(0);
  const [absentDays, setAbsentDays] = useState(0);
  const [attendanceMap, setAttendanceMap] = useState<any>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchTodayAttendance = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/attendance/today/${user._id}`
        );

        const data = await res.json();

        if (data) {
          setCheckInTime(data.checkIn || "");
          setCheckOutTime(data.checkOut || "");

          if (data.checkIn && !data.checkOut) {
            setIsCheckedIn(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTodayAttendance();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/attendance/${user._id}`
        );

        const data = await res.json();

        const present = data.length;
        setPresentDays(present);

        const today = new Date();
        const todayDate = today.getDate();

        const year = today.getFullYear();
        const month = today.getMonth();

        let workingDays = 0;

        for (let d = 1; d <= todayDate; d++) {
          const day = new Date(year, month, d).getDay();
          const isSunday = day === 0;
          const isSaturday = day === 6;

          if (!isSunday && !(isSaturday && false)) {
            workingDays++;
          }
        }

        setAbsentDays(workingDays - present);

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

  const [currentDate, setCurrentDate] = useState(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAttendance = async () => {
    if (!user) return;

    try {
      if (!isCheckedIn) {
        const res = await fetch("http://localhost:5000/api/attendance/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });

        const data = await res.json();
        setCheckInTime(data.checkIn);
        setIsCheckedIn(true);
      } else {
        const res = await fetch("http://localhost:5000/api/attendance/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });

        const data = await res.json();
        setCheckOutTime(data.checkOut);
        setIsCheckedIn(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.greeting}>
        {greeting}{" "}
        {userName.charAt(0).toUpperCase() + userName.slice(1)} 👋
      </h1>

      <p style={styles.subText}>
        Here's your attendance overview for today.
      </p>

      <div style={styles.cardRow}>
        <Card title="Present Days" value={presentDays} icon={<CheckCircle color="#22c55e" />} bg="#eafaf1" />
        <Card title="Absent Days" value={absentDays} icon={<XCircle color="#ef4444" />} bg="#fdecec" />
        <Card title="Leaves Used" value={Math.min(absentDays, 12)} icon={<Coffee color="#f59e0b" />} bg="#fff7ed"/>
        <Card title="Avg Hours" value="8.5h" icon={<Clock color="#3b82f6" />} bg="#eef4ff" />
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.attendanceBox}>
          <h3>Today's Attendance</h3>

          <div
            style={{
              ...styles.checkInBtn,
              background: isCheckedIn ? "#ef4444" : "#4f7cff",
            }}
            onClick={handleAttendance}
          >
            {isCheckedIn ? "OUT" : "IN"}
          </div>

          <div style={styles.timeRow}>
            <div style={styles.timeBox}>
              Login {checkInTime || "--:--"}
            </div>
            <div style={styles.timeBox}>
              Logout {checkOutTime || "--:--"}
            </div>
          </div>
        </div>

        {/* 🔥 UPDATED CALENDAR */}
        <div style={styles.calendarBox}>
          <div style={styles.calendarHeader}>
            <button onClick={handlePrevMonth}>◀</button>
            <h3>
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h3>
            <button onClick={handleNextMonth}>▶</button>
          </div>

          <div style={styles.calendarGrid}>
            {days.map((d) => (
              <div key={d} style={styles.dayHeader}>{d}</div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={"empty" + i}></div>
            ))}

            {Array.from({ length: totalDays }, (_, i) => {
              const date = i + 1;

              const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

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

                    ...(isPresent
                      ? { background: "#22c55e", color: "#fff", borderRadius: "6px" }
                      : {}),

                    ...(!isPresent && isPast && !isHoliday && !isToday
                      ? { background: "#ef4444", color: "#fff", borderRadius: "6px" }
                      : {}),

                    ...(isHoliday
                      ? { background: "#3b82f6", color: "#fff", borderRadius: "6px" }
                      : {}),

                    ...(isToday ? styles.activeDate : {}),
                  }}
                >
                  {date}
                </div>
              );
            })}
          </div>

          <div style={styles.legend}>
            <span>🟢 Present</span>
            <span>🔴 Absent</span>
            <span>🔵 Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, bg }: any) => (
  <div style={styles.card}>
    <div style={{ ...styles.iconWrapper, background: bg }}>{icon}</div>
    <div>
      <h2 style={styles.cardValue}>{value}</h2>
      <p style={styles.cardTitle}>{title}</p>
    </div>
  </div>
);

export default Dashboard;

/* STYLES (UNCHANGED) */
const styles: any = {
  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "16px",
    background: "transparent",
  },
  greeting: { marginTop: "18px" },
  subText: { color: "#777" },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginTop: "16px",
  },
  card: {
    display: "flex",
    gap: "10px",
    background: "#fff",
    padding: "12px",
    borderRadius: "14px",
  },
  iconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardValue: { margin: 0 },
  cardTitle: { fontSize: "13px" },
  bottomSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
  attendanceBox: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
  },
  checkInBtn: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "18px auto",
    cursor: "pointer",
  },
  timeRow: { display: "flex", gap: "8px" },
  timeBox: {
    flex: 1,
    background: "#f3f3f3",
    padding: "8px",
    borderRadius: "8px",
    textAlign: "center",
  },
  calendarBox: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
    marginTop: "10px",
  },
  dayHeader: { textAlign: "center", fontSize: "12px" },
  dateCell: { textAlign: "center", padding: "6px" },
  activeDate: {
    border: "2px solid #4f7cff",
    borderRadius: "6px",
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
    fontSize: "12px",
  },
};