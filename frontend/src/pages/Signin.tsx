import React, { useState } from "react";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ViewType = "login" | "register" | "forgot";

const Signin: React.FC = () => {
  const [view, setView] = useState<ViewType>("login");

  const navigate = useNavigate();

  // 🔥 Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Register state
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // ✅ LOGIN
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

      if (data.success) {
        // 🔥 Redirect
        localStorage.setItem("user", JSON.stringify(data.user)); // 🔥 save user
navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ REGISTER
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Account created successfully");

        // 🔥 Switch to login
        setView("login");
      } else {
        alert("Error creating account");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {view === "login"
            ? "Sign In"
            : view === "register"
            ? "Create Account"
            : "Forgot Password"}
        </h1>

        <p style={styles.subtitle}>
          {view === "login" && "Welcome back! Please login to your account."}
          {view === "register" && "Create a new account to continue."}
          {view === "forgot" && "Enter your email to reset password."}
        </p>

        {/* 🔥 LOGIN */}
        {view === "login" && (
          <>
            <Input
              icon={<Mail size={18} />}
              placeholder="Email address"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />

            <Input
              icon={<Lock size={18} />}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />

            <div style={styles.rowBetween}>
              <span style={styles.link} onClick={() => setView("forgot")}>
                Forgot Password?
              </span>
            </div>

            <button style={styles.button} onClick={handleLogin}>
              Sign In
            </button>

            <p style={styles.footerText}>
              Don’t have an account?{" "}
              <span style={styles.link} onClick={() => setView("register")}>
                Create Account
              </span>
            </p>
          </>
        )}

        {/* 🔥 REGISTER */}
        {view === "register" && (
          <>
            <Input
              icon={<User size={18} />}
              placeholder="Full Name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />

            <Input
              icon={<Mail size={18} />}
              placeholder="Email address"
              value={regEmail}
              onChange={(e: any) => setRegEmail(e.target.value)}
            />

            <Input
              icon={<Lock size={18} />}
              placeholder="Password"
              type="password"
              value={regPassword}
              onChange={(e: any) => setRegPassword(e.target.value)}
            />

            <button style={styles.button} onClick={handleRegister}>
              Create Account
            </button>

            <p style={styles.footerText}>
              Already have an account?{" "}
              <span style={styles.link} onClick={() => setView("login")}>
                Sign In
              </span>
            </p>
          </>
        )}

        {/* FORGOT */}
        {view === "forgot" && (
          <>
            <Input icon={<Mail size={18} />} placeholder="Email address" />

            <button style={styles.button}>Send Reset Link</button>

            <p style={styles.footerText}>
              <span style={styles.link} onClick={() => setView("login")}>
                <ArrowLeft size={14} /> Back to Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signin;

/* INPUT */
const Input = ({ icon, placeholder, type = "text", value, onChange }: any) => (
  <div style={styles.inputBox}>
    <span style={styles.icon}>{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      style={styles.input}
      value={value}
      onChange={onChange}
    />
  </div>
);

/* STYLES (same) */
const styles: any = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  title: {
    fontSize: "24px",
    fontWeight: "600",
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "14px",
  },

  icon: {
    color: "#9ca3af",
  },

  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: "14px",
    background: "transparent",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#4f7cff",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "10px",
  },

  footerText: {
    marginTop: "16px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },

  link: {
    color: "#4f7cff",
    cursor: "pointer",
    fontWeight: "500",
  },
};