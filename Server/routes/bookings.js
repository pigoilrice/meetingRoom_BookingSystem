const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const { authMiddleware } = require("../middleware");

// POST /api/bookings - 新增一筆預約
router.post("/", authMiddleware, async (req, res) => {
  try {
    // 從前端收到的資料
    const { roomId, date, startTime, endTime } = req.body;

    const newBooking = new Booking({
      user: req.user.id,
      room: roomId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      status: "upcoming",
    });

    await newBooking.save();
    res.status(201).json({ message: "預約成功！", booking: newBooking });
  } catch (e) {
    console.error("預約失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，預約失敗" });
  }
});

// GET /api/bookings/my-bookings - 取得個人的預約紀錄
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    // 直接去 Booking 資料表找出這個人的訂單，
    // 並且用 .populate('room') 把關聯的房間詳細資料一併拉出來！
    const userBookings = await Booking.find({ user: req.user.id })
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(userBookings);
  } catch (e) {
    console.error("撈取個人預約失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，無法取得預約紀錄" });
  }
});

// PUT /api/bookings/:id - 修改特定的預約時間
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // 1. 從前端收到的新資料 (使用者想改成哪天、幾點)
    const { date, startTime, endTime } = req.body;

    // 2. 使用 Mongoose 來更新
    const updateBooking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
      { returnDocument: "after" }, // 告訴 MongoDB「請回傳更新後的最新資料給我」，而不是舊資料
    ).populate("room");

    if (!updateBooking) {
      return res
        .status(400)
        .json({ message: "找不到此預約，或您沒有權限修改這筆預約！" });
    }

    // 3. 回傳成功訊息與更新後的訂單
    res.json({ message: "預約時間修改成功！", booking: updateBooking });
  } catch (e) {
    console.error("修改預約失敗：", err);
    res.status(500).json({ message: "伺服器發生錯誤，無法修改預約" });
  }
});

// DELETE /api/bookings/:id - 取消/刪除 特定預約
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // 使用 Mongoose 指令，雙重防護！
    const deleteBooking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    // 防呆：如果資料庫裡根本沒這個 ID
    if (!deleteBooking) {
      return res
        .status(400)
        .json({ message: "找不到此預約，或您沒有權限取消這筆預約！" });
    }

    // 3. 成功刪除後，回傳訊息給前端
    res.json({ message: "預約已成功取消！" });
  } catch (e) {
    console.error("取消預約失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，無法取消預約" });
  }
});

module.exports = router;
