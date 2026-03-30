const jwt = require("jsonwebtoken");

module.exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(400).json({ message: "拒絕存取，請先登入！" });

  try {
    // 業界標準寫法通常會帶有 "Bearer " 前綴，所以我們要把它切掉，只留後面的亂碼
    const trueToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(trueToken, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (e) {
    console.error("Token 驗證失敗：", e);
    res.status(401).json({ message: "無效的token，請重新登入！" });
  }
};
