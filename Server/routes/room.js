const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const { authMiddleware } = require("../middleware");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const query = {
      $or: [{ createBy: null }, { createBy: { $exists: false } }],
    };

    if (userId) {
      query.$or.push({ createBy: userId });
    }

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, capacity, size, description, image } = req.body;

    if (!name || !capacity || !size)
      return res.status(400).json({ message: "請填寫完整資訊！" });

    const newRoom = new Room({
      name,
      capacity: Number(capacity),
      size,
      description: description || "這是一間舒適的會議室。",
      image:
        image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      createBy: req.user.id,
    });

    await newRoom.save();

    res.status(201).json({ message: `成功建立 ${name}！`, room: newRoom });
  } catch (e) {
    console.error("新增房間失敗：", e);
    res.status(500).json({ message: "伺服器發生錯誤，無法建立會議室" });
  }
});

module.exports = router;
