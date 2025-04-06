const express = require("express");
const { 
  sendMessage, 
  getMessages, 
  getConversations, 
  markAsRead,
  getChatUsers
} = require("../controllers/ChatController");
const { verifyToken, checkRole } = require("../middleware/auth"); // Giả định middleware xác thực
const router = express.Router();

// Áp dụng middleware xác thực cho tất cả các routes
router.use(verifyToken);

// Route gửi tin nhắn
router.post("/send-message", sendMessage);

// Route lấy tin nhắn giữa User và Skincare_staff
router.get("/messages/:userId", getMessages);

// Route lấy danh sách cuộc trò chuyện
router.get("/conversations", getConversations);

// Route đánh dấu tin nhắn đã đọc
router.put("/mark-read/:roomId", markAsRead);

// Route lấy danh sách người dùng có thể chat
router.get("/chat-users", getChatUsers);

// Route lấy danh sách nhân viên Skincare (cho người dùng thông thường)
router.get("/skincare-staff", checkRole(["user"]), async (req, res) => {
  try {
    const skincareStaff = await User.find(
      { role: "skincare_staff", isOnline: true },
      'username avatar isOnline'
    );
    res.status(200).json(skincareStaff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;