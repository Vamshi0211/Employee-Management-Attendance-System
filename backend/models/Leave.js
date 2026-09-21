const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  userId: String,
  name: String,
  type: String,
  date: String,
  reason: String,
  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Leave", LeaveSchema);