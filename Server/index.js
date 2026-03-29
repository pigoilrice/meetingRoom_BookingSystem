// server/index.js
const env = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

env.config();
const app = express();

//Middleware
app.use(cors()); // allow front end request data
app.use(express.json()); // 解析前端傳來的 JSON 資料

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connect to MongoDB..");
  })
  .catch((err) => {
    console.log("Connect error...", err);
  });

const roomRoutes = require("./routes/room");
const bookingRoutes = require("./routes/bookings");
const authRoutes = require("./routes/auth");

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("it's good");
});

//setting port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}...`);
});
