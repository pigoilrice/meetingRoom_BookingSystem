const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Mongoose 會自動幫你加上 createdAt 和 updatedAt (紀錄時間集)
  },
);

module.exports = mongoose.model("User", userSchema);
