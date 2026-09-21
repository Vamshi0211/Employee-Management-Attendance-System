import React from "react";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  ClipboardList,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  isMobile: boolean; // ✅ REQUIRED
};

const Sidebar: React.FC<Props> = ({ collapsed, setCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 GET USER
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // MENU
  const userMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
    { name: "Apply Leave", icon: <FileText size={20} />, path: "/apply-leave" },
    { name: "Leave Tracker", icon: <ClipboardList size={20} />, path: "/leave-tracker" },
    { name: "Notices", icon: <Megaphone size={20} />, path: "/notices" },
  ];

  const adminMenu = [
    {
      name: "Admin Panel",
      icon: <ShieldCheck size={20} />,
      path: "/admin-login",
    },
  ];

  // NAVIGATION
  const handleNavigation = (path: string) => {
    if (path === "/admin-login") {
      const admin = localStorage.getItem("admin");
      admin ? navigate("/admin") : navigate("/admin-login");
    } else {
      navigate(path);
    }

    // 🔥 CLOSE SIDEBAR ON MOBILE
    if (isMobile) setCollapsed(true);
  };

  const renderMenu = (menu: any[]) =>
    menu.map((item) => {
      const active = location.pathname.startsWith(item.path);

      return (
        <div
          key={item.name}
          onClick={() => handleNavigation(item.path)}
          style={{
            ...styles.menuItem,
            ...(active ? styles.activeItem : {}),
            justifyContent: !isMobile && collapsed ? "center" : "flex-start",
          }}
        >
          {item.icon}
          {(!collapsed || isMobile) && <span>{item.name}</span>}
        </div>
      );
    });

  return (
    <>
      {/* 🔥 SIDEBAR */}
      <div
        style={{
          ...styles.sidebar,
          width: isMobile ? "220px" : collapsed ? "70px" : "220px",
          left: isMobile ? (collapsed ? "-100%" : "0") : "0",
        }}
      >
        {/* PROFILE */}
        {!collapsed && (
          <div style={styles.profile}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h3 style={{ margin: 0 }}>
              {user?.name || "User"}
            </h3>
          </div>
        )}

        {/* USER MENU */}
        <p style={styles.menuTitle}>Menu</p>
        <div>{renderMenu(userMenu)}</div>

        {/* ADMIN */}
        <p style={styles.menuTitle}>Admin</p>
        <div>{renderMenu(adminMenu)}</div>
      </div>

      {/* 🔥 OVERLAY (ONLY MOBILE) */}
      {isMobile && !collapsed && (
        <div
          style={styles.overlay}
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;

/* STYLES */
const styles: any = {
  sidebar: {
    height: "100vh",
    background: "#f9fafb",
    padding: "12px",
    position: "fixed",
    top: 0,
    borderRight: "1px solid #eee",
    transition: "0.3s ease",
    zIndex: 2000,
  },

  profile: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "20px",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#5b7cfa",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  menuTitle: {
    marginTop: "12px",
    fontSize: "12px",
    color: "#9ca3af",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "6px",
  },

  activeItem: {
    background: "#e0e7ff",
    color: "#4f7cff",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 1500,
  },
};