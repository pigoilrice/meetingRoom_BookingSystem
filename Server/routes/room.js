const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});
    // 把撈出來的資料轉換成 JSON 格式，回傳給前端
    res.json(rooms);
  } catch (e) {
    console.error("撈取房間資料失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，無法取得會議室列表" });
  }
});

module.exports = router;
