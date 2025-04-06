const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }, // Thêm trạng thái đã đọc
    room: { type: String }, // Thêm room id để hỗ trợ socket.io
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);