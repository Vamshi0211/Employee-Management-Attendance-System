import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true); // 🔥 default closed for mobile
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 DETECT SCREEN SIZE
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // auto collapse on mobile
      if (mobile) setCollapsed(true);
      else setCollapsed(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      {/* MAIN */}
      <div
        style={{
          ...styles.main,
          marginLeft: !isMobile ? (collapsed ? "70px" : "220px") : "0",
        }}
      >
        {/* 🔥 TOP BAR */}
        <div style={styles.topbar}>
          {/* ☰ HAMBURGER (ONLY MOBILE) */}
          {isMobile && (
            <div
              style={styles.hamburger}
              onClick={() => setCollapsed(false)}
            >
              ☰
            </div>
          )}

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

/* STYLES */
const styles: any = {
  wrapper: {
    display: "flex",
    width: "100%",
  },

  main: {
    flex: 1,
    minHeight: "100vh",
    background: "#f5f7fb",
    transition: "margin-left 0.3s ease",
  },

  topbar: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 999,
  },

  hamburger: {
    fontSize: "22px",
    cursor: "pointer",
    marginRight: "auto",
  },

  content: {
    padding: "16px",
    width: "100%",
  },

  logoutBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    marginLeft: "auto",
  },
};