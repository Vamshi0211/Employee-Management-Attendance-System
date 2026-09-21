const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

// ✅ APPLY LEAVE
router.post("/apply", async (req, res) => {
  try {
    console.log("Incoming Leave:", req.body);

    const leave = new Leave({
      userId: req.body.userId,
      name: req.body.name,
      type: req.body.type,
      date: req.body.date,
      reason: req.body.reason,
      status: "Pending",
    });

    await leave.save();

    console.log("Saved Leave:", leave);

    res.json(leave);
  } catch (err) {
    console.error("Apply Leave Error:", err);
    res.status(500).json({ msg: "Error applying leave" });
  }
});

// ✅ GET USER LEAVES
router.get("/user/:userId", async (req, res) => {
  try {
    console.log("Fetching leaves for:", req.params.userId);

    const leaves = await Leave.find({ userId: req.params.userId });

    res.json(leaves);
  } catch (err) {
    console.error("User Leaves Error:", err);
    res.status(500).json({ msg: "Error fetching user leaves" });
  }
});

// ✅ GET ALL LEAVES (ADMIN)
router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ date: -1 });

    console.log("All Leaves:", leaves);

    res.json(leaves);
  } catch (err) {
    console.error("Get Leaves Error:", err);
    res.status(500).json({ msg: "Error fetching leaves" });
  }
});

// 🔐 UPDATED: SAFE STATUS UPDATE (ADMIN)
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating:", req.params.id, req.body.status);

    const leave = await Leave.findById(req.params.id);

    // ❌ not found
    if (!leave) {
      return res.status(404).json({ msg: "Leave not found" });
    }

    // 🔐 prevent re-update
    if (leave.status !== "Pending") {
      return res.status(400).json({
        msg: "Leave already processed. Cannot update again.",
      });
    }

    // ✅ update only if pending
    leave.status = req.body.status;
    await leave.save();

    console.log("Updated Successfully:", leave);

    res.json(leave);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ msg: "Error updating leave" });
  }
});

module.exports = router;