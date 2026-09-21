import React, { useState } from "react";
import toast from "react-hot-toast"; // 🔥 ADD THIS

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ❌ invalid credentials
      if (!data.success) {
        toast.error("Invalid credentials"); // ✅ TOAST
        return;
      }

      // ❌ not admin
      if (data.user.role !== "admin") {
        toast.error("You are not admin"); // ✅ TOAST
        return;
      }

      // ✅ STORE ADMIN
      localStorage.setItem("admin", JSON.stringify(data.user));

      // ✅ SUCCESS MESSAGE
      toast.success("Admin login successful 🎉");

      // 🔥 DELAY REDIRECT (so toast is visible)
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);

    } catch (err) {
      console.error("Admin Login Error:", err);
      toast.error("Something went wrong"); // ✅ TOAST
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login as Admin
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;

/* STYLES */
const styles: any = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "15px",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    background: "#4f7cff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
};