const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");

// POST /api/bookings - 新增一筆預約
router.post("/", async (req, res) => {
  try {
    // 1. 從前端收到的資料
    const { roomId, date, startTime, endTime, userName, userEmail } = req.body;
    // 2. 尋找使用者，如果沒有這個信箱，就自動幫他建立一個假帳號
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: userName || "Guest",
        email: userEmail,
        password: "dummy_password_123", // 隨便塞個密碼騙過資料庫的 required
      });
    }

    // 3. 建立並儲存預約紀錄
    const newBooking = new Booking({
      user: user._id,
      room: roomId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      status: "upcoming",
    });

    await newBooking.save();
    // 4. 回傳成功訊息給前端
    res.status(201).json({ message: "預約成功！", booking: newBooking });
  } catch (e) {
    console.error("預約失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，預約失敗" });
  }
});

module.exports = router;
