const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    date: {
      type: String, // 格式例如: "2026-03-20"
      required: true,
    },
    startTime: {
      type: String, // 格式例如: "14:00"
      required: true,
    },
    endTime: {
      type: String, // 格式例如: "16:00"
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"], // 限制只能是這三種狀態
      default: "upcoming",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
