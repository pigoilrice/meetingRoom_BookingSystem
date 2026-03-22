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

// GET /api/bookings/my-bookings - 取得個人的預約紀錄
router.get("/my-bookings", async (req, res) => {
  try {
    // 1. 我們暫時透過網址參數 (?email=xxx) 來判斷是誰在查詢
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "缺少使用者信箱" });
    }

    // 2. 先找找看資料庫裡有沒有這個人
    const user = await User.findOne({ email });
    if (!user) {
      return res.json([]);
    }

    // 3. 去 Booking 資料表找出這個人的訂單，
    // 並且用 .populate('room') 把關聯的房間詳細資料一併拉出來！
    const userBookings = await Booking.find({ user: user._id })
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(userBookings);
  } catch (e) {
    console.error("撈取個人預約失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，無法取得預約紀錄" });
  }
});

// PUT /api/bookings/:id - 修改特定的預約時間
router.put("/:id", async (req, res) => {
  try {
    // 1. 從前端收到的新資料 (使用者想改成哪天、幾點)
    const bookingId = req.params.id;
    const { date, startTime, endTime } = req.body;

    // 2. 使用 Mongoose 來更新
    const updateBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
      { returnDocument: "after" }, // 告訴 MongoDB「請回傳更新後的最新資料給我」，而不是舊資料
    ).populate("room");

    if (!updateBooking) {
      return res.status(400).json({ message: "找不到這筆預約紀錄" });
    }

    // 3. 回傳成功訊息與更新後的訂單
    res.json({ message: "預約時間修改成功！", booking: updateBooking });
  } catch (e) {
    console.error("修改預約失敗：", err);
    res.status(500).json({ message: "伺服器發生錯誤，無法修改預約" });
  }
});

// DELETE /api/bookings/:id - 取消/刪除 特定預約
router.delete("/:id", async (req, res) => {
  try {
    // 1. 從網址列 (params) 抓取前端傳來的訂單 ID
    const bookingId = req.params.id;

    // 2. 使用 Mongoose 指令，直接找 ID 並刪除它！
    const deleteBooking = await Booking.findByIdAndDelete(bookingId);

    // 防呆：如果資料庫裡根本沒這個 ID
    if (!deleteBooking) {
      return res.status(400).json({ message: "找不到這筆預約紀錄" });
    }

    // 3. 成功刪除後，回傳訊息給前端
    res.json({ message: "預約已成功取消！" });
  } catch (e) {
    console.error("取消預約失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，無法取消預約" });
  }
});

module.exports = router;
