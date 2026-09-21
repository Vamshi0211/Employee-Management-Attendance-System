const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(
    "mongodb://your_username:your_password@cluster-shard-00-00.xxxxx.mongodb.net:27017,cluster-shard-00-01.xxxxx.mongodb.net:27017,cluster-shard-00-02.xxxxx.mongodb.net:27017/your_database?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running...");
});

// ✅ ROUTES (🔥 FIXED)

// AUTH
app.use("/api/auth", require("./routes/authRoutes"));

// ATTENDANCE
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// ✅ LEAVES (🔥 IMPORTANT - YOU MISSED THIS)
app.use("/api/leaves", require("./routes/leaveRoutes"));

// ✅ NOTICES (🔥 FIXED PATH)
app.use("/api/notices", require("./routes/adminRoutes"));

// START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});