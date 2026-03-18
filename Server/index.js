// server/index.js
const env = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const roomRoutes = require("./routes/room");
const bookingRoutes = require("./routes/bookings");

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

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("it's good");
});

//setting port
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}...`);
});
