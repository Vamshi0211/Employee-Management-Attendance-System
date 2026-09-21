const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: String,
  date: String,
  checkIn: String,
  checkOut: String,
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

// ✅ CHECK-IN
router.post("/checkin", async (req, res) => {
  const { userId } = req.body;

  const today = new Date().toISOString().split("T")[0];

  try {
    // 🔥 Prevent duplicate check-in
    let existing = await Attendance.findOne({ userId, date: today });

    if (existing) {
      return res.json(existing);
    }

    const record = new Attendance({
      userId,
      date: today,
      checkIn: new Date().toLocaleTimeString(),
    });

    await record.save();
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error checking in" });
  }
});

// ✅ CHECK-OUT
router.post("/checkout", async (req, res) => {
  const { userId } = req.body;

  const today = new Date().toISOString().split("T")[0];

  try {
    const record = await Attendance.findOne({ userId, date: today });

    if (!record) {
      return res.status(404).json({ msg: "No check-in found" });
    }

    // 🔥 Prevent duplicate checkout
    if (record.checkOut) {
      return res.json(record);
    }

    record.checkOut = new Date().toLocaleTimeString();
    await record.save();

    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error checking out" });
  }
});

// ✅ GET TODAY'S RECORD
router.get("/today/:userId", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const record = await Attendance.findOne({
      userId: req.params.userId,
      date: today,
    });

    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching data" });
  }
});

// 🔥 NEW: GET ALL ATTENDANCE (HISTORY)
router.get("/:userId", async (req, res) => {
  try {
    const records = await Attendance.find({
      userId: req.params.userId,
    }).sort({ date: -1 }); // latest first

    res.json(records);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching history" });
  }
});

module.exports = router;