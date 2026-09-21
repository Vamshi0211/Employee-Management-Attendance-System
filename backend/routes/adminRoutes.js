const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");

// ✅ CREATE NOTICE
router.post("/", async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.json(notice);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error creating notice" });
  }
});

// ✅ GET ALL NOTICES
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching notices" });
  }
});

module.exports = router;