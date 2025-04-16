const Cart = require("../models/cartModel");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  const { sender, content, cartId } = req.body;

  if (!sender || !content || !cartId) {
    return res
      .status(400)
      .json({ message: "Thiếu sender, content hoặc cartId." });
  }

  try {
    const cart = await Cart.findOne({ CartID: cartId });
    if (!cart || !cart.Skincare_staff) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy bác sĩ cho đơn hàng này." });
    }

    const message = new Message({
      sender,
      receiver: cart.Skincare_staff,
      content,
      cartId, // ✅ Thêm dòng này
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("❌ Không thể lưu tin nhắn:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


// GET: Lấy toàn bộ tin nhắn giữa user và bác sĩ theo thứ tự thời gian
exports.getMessages = async (req, res) => {
  const { cartId, receiver } = req.query;

  if (!cartId) {
    return res.status(400).json({ message: "Thiếu cartId." });
  }

  const query = { cartId };

  if (receiver) {
    query.receiver = receiver; // 👈 chỉ lấy tin nhắn mà bác sĩ là người nhận
  }

  try {
    const messages = await Message.find(query).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy tin nhắn", error });
  }
};

exports.getAssignedCarts = async (req, res) => {
  const { receiver } = req.query;
  if (!receiver) return res.status(400).json({ message: "Thiếu receiver" });

  try {
    const carts = await Message.distinct("cartId", { receiver });
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
