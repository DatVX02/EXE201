const Booking = require("../models/booking");

// Tạo booking mới
exports.createBooking = async (req, res) => {
  try {
    const {
      service_id,
      service_name,
      customerName,
      customerEmail,
      customerPhone,
      username,
      quantity,
      price,
      paymentMethod,
      productType,
      orderCode, // ✅ lấy orderCode từ frontend
    } = req.body;

    const newBooking = new Booking({
      service_id,
      service_name,
      customerName,
      customerEmail,
      customerPhone,
      username,
      quantity,
      price,
      paymentMethod,
      productType: productType || "purchase",
      orderCode,
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking đã lưu thành công",
      data: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: "Lỗi khi lưu booking" });
  }
};

// Lấy tất cả booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy booking theo ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }
    res.status(200).json({ data: booking });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy tất cả booking của 1 user
exports.getBookingByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const bookings = await Booking.find({ username });
    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error("Lỗi khi lấy booking:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy đơn hàng người dùng đã mua
exports.getUserPurchases = async (req, res) => {
  try {
    const username = req.params.username;
    const purchases = await Booking.find({
      productType: "purchase",
      username,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Danh sách sản phẩm đã mua",
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy đơn mua hàng" });
  }
};

// Cập nhật trạng thái booking theo ID
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "cancel", "checked-out"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const updated = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy booking." });
    }

    res
      .status(200)
      .json({ message: "Cập nhật trạng thái thành công", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Cập nhật trạng thái theo orderCode
exports.updateBookingStatusByOrderCode = async (req, res) => {
  const { orderCode } = req.params;
  const { status } = req.body;

  if (!["pending", "completed", "cancel", "checked-out"].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ." });
  }

  try {
    const result = await Booking.updateMany(
      { orderCode },
      { $set: { status } }
    );

    res.status(200).json({
      message: `Cập nhật trạng thái '${status}' cho ${result.modifiedCount} booking.`,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật theo orderCode:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
  }
};

// Lấy danh sách theo orderCode
exports.getBookingsByOrderCode = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const bookings = await Booking.find({ orderCode });
    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
