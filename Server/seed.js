// server/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Room = require("./models/Room");

// 準備要植入的種子資料 (陣列)
const seedRooms = [
  {
    name: "會議室 A (大型)",
    capacity: 12,
    size: "大",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500",
    description: "配備頂級投影設備與視訊會議系統，適合大型團隊會議或客戶提案。",
  },
  {
    name: "創意空間 (中型)",
    capacity: 8,
    size: "中",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=500",
    description: "備有大面積白板牆，環境輕鬆，適合腦力激盪與小組討論。",
  },
  {
    name: "面試間 (小型)",
    capacity: 4,
    size: "小",
    image:
      "https://images.unsplash.com/photo-1505409859467-3a799c240121?auto=format&fit=crop&w=500",
    description: "安靜具隱私性，適合 1 對 1 面試或少人數的機密會議。",
  },
];

const seedDB = async () => {
  try {
    // 1. 連線到資料庫
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/MeetingRoomDB",
    );
    console.log("connect successfull, ready to insert seed data...");

    // 2. 清除舊資料 (非常重要：這樣你重複執行腳本才不會有 600 間一模一樣的會議室)
    await Room.deleteMany({});
    console.log("old room data already be empty -----");

    // 3. 批量寫入新資料
    await Room.insertMany(seedRooms);
    console.log("seed data already connect to database => ");
  } catch (e) {
    console.error("data error: ", e);
  } finally {
    // 4. 執行完畢後，斷開資料庫連線，讓終端機自動結束這個腳本
    mongoose.connection.close();
  }
};

seedDB();
