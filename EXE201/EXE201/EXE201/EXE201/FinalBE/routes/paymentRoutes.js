const express = require("express");
const router = express.Router();
const axios = require("axios");
const payOS = require("../utils/payos");
const Payment = require("../models/Payment");
const Booking = require("../models/booking");
//API tạo link thanh toán
router.post("/create", async (req, res) => {
  const {
    cart,
    customerName,
    customerEmail,
    customerPhone,
    paymentMethod,
    orderName = "Đơn hàng sản phẩm",
    description = "Thanh toán đơn hàng",
    returnUrl,
    cancelUrl,
    amount,
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!cart || cart.length === 0 || !amount || !returnUrl || !cancelUrl) {
    return res.status(400).json({
      error: -1,
      message: "Thiếu thông tin đơn hàng hoặc giỏ hàng trống.",
    });
  }

  const truncatedDescription =
    description.length > 25 ? description.substring(0, 25) : description;

  const orderCode = Number(String(new Date().getTime()).slice(-6));

  try {
    // 🔹 Lưu từng sản phẩm booking vào DB
    for (const item of cart) {
      const price =
        typeof item.price === "object"
          ? parseFloat(item.price.$numberDecimal)
          : item.price;

      const newBooking = new Booking({
        service_id: item._id,
        service_name: item.name,
        customerName,
        customerEmail,
        customerPhone,
        quantity: item.quantity,
        price,
        paymentMethod,
        productType: item.productType || "purchase",
        orderCode, // ✅ bắt buộc để cập nhật về sau
      });
      await newBooking.save();
    }

    // 🔹 Nếu là phương thức PayOS → gọi API tạo link
    if (paymentMethod === "payos") {
      const paymentLinkRes = await payOS.createPaymentLink({
        orderCode,
        amount,
        description: truncatedDescription,
        returnUrl,
        cancelUrl,
        orderName,
      });

      // 🔹 Lưu payment
      const newPayment = new Payment({
        orderCode,
        orderName,
        amount,
        description: truncatedDescription,
        status: "pending",
        returnUrl,
        cancelUrl,
      });

      await newPayment.save();

      return res.json({
        error: 0,
        message: "Tạo thanh toán thành công",
        data: {
          checkoutUrl: paymentLinkRes.checkoutUrl,
          qrCode: paymentLinkRes.qrCode,
          orderCode: paymentLinkRes.orderCode,
          amount: paymentLinkRes.amount,
          description: truncatedDescription,
        },
      });
    } else {
      // 🔹 Nếu thanh toán COD hoặc Bank → không cần tạo link
      return res.json({
        error: 0,
        message: "Đơn hàng đã được lưu. Không cần thanh toán online.",
        data: {
          checkoutUrl: returnUrl,
        },
      });
    }
  } catch (error) {
    console.error(
      "❌ Lỗi khi tạo thanh toán:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: -1,
      message: "Không thể xử lý thanh toán",
      data: error.message,
    });
  }
});

// 🔹 API kiểm tra trạng thái thanh toán
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Payment.findOne({ orderCode: req.params.orderId });
    if (!order) {
      return res.status(404).json({
        error: -1,
        message: "Order not found",
        data: null,
      });
    }
    return res.json({
      error: 0,
      message: "Order retrieved",
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({
      error: -1,
      message: "Failed to fetch order",
      data: null,
    });
  }
});

// 🔹 API cập nhật trạng thái thanh toán
router.put("/update/:orderCode", async (req, res) => {
  try {
    const { status } = req.body;
    const { orderCode } = req.params;

    // Kiểm tra nếu status hợp lệ
    if (!["pending", "success", "failed", "cancelled"].includes(status)) {
      return res.status(400).json({
        error: -1,
        message: "Invalid status",
      });
    }

    // Tìm và cập nhật trạng thái thanh toán
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderCode },
      { status },
      { new: true } // Trả về bản ghi mới nhất sau khi cập nhật
    );

    if (!updatedPayment) {
      return res.status(404).json({
        error: -1,
        message: "Order not found",
      });
    }
    if (status === "success") {
      const relatedBookings = await Booking.find({ orderCode });
      console.log("Booking cần cập nhật:", relatedBookings);

      await Booking.updateMany({ orderCode }, { status: "checked-out" });
    }

    return res.json({
      error: 0,
      message: "Payment status updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    return res.status(500).json({
      error: -1,
      message: "Failed to update payment status",
    });
  }
});

// 🔹 API lấy thông tin tất cả thanh toán
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
    return res.json({
      error: 0,
      message: "All payments retrieved",
      data: payments,
    });
  } catch (error) {
    console.error("Get All Payments Error:", error);
    return res.status(500).json({
      error: -1,
      message: "Failed to fetch payments",
      data: null,
    });
  }
});

module.exports = router;
