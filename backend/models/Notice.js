const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: String,
  description: String,

  // ✅ NEW FIELD (IMPORTANT)
  type: {
    type: String,
    enum: ["important", "event", "info", "general"],
    default: "general",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notice", NoticeSchema);