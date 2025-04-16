const express = require("express");
const router = express.Router();
const axios = require("axios");
const payOS = require("../utils/payos");
const Payment = require("../models/Payment");
const Booking = require("../models/booking");

// API tạo link thanh toán
router.post("/create", async (req, res) => {
  let {
    cart,
    customerName,
    customerEmail,
    customerPhone,
    paymentMethod,
    orderName,
    description,
    returnUrl,
    cancelUrl,
    amount,
  } = req.body;

  if (!cart || cart.length === 0 || !amount || !returnUrl || !cancelUrl) {
    return res.status(400).json({
      error: -1,
      message: "Thiếu thông tin đơn hàng hoặc giỏ hàng trống.",
    });
  }

  const productNames = cart
    .map((item) => item.name || item.service_name)
    .join(", ");
  orderName = orderName || `Đơn hàng: ${productNames}`;
  description = description || `Thanh toán cho: ${productNames}`;
  const truncatedDescription =
    description.length > 50 ? description.substring(0, 50) : description;

  const orderCode = Date.now();

  try {
    for (const item of cart) {
      const price =
        typeof item.price === "object"
          ? parseFloat(item.price.$numberDecimal)
          : item.price;

      const newBooking = new Booking({
        BookingID: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        BookingCode: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        service_id: item._id,
        service_name: item.name,
        customerName,
        customerEmail,
        customerPhone,
        quantity: item.quantity,
        price,
        paymentMethod,
        productType: item.productType || "purchase",
        orderCode,
      });

      await newBooking.save();
    }

    const hasPurchase = cart.some((item) => item.productType === "purchase");
    const hasConsultation = cart.some(
      (item) => item.productType === "consultation"
    );

    let paymentLinkRes = null;
    if ((paymentMethod === "payos" && hasPurchase) || hasConsultation) {
      paymentLinkRes = await payOS.createPaymentLink({
        orderCode,
        amount,
        description: truncatedDescription,
        returnUrl,
        cancelUrl,
        orderName,
      });
    }

    const newPayment = new Payment({
      paymentID: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderCode,
      orderName,
      amount,
      description: truncatedDescription,
      status: "pending",
      returnUrl,
      cancelUrl,
      checkoutUrl: paymentLinkRes?.checkoutUrl || returnUrl,
      qrCode: paymentLinkRes?.qrCode || null,
    });

    await newPayment.save();

    return res.json({
      error: 0,
      message: "Tạo thanh toán thành công",
      data: {
        checkoutUrl: paymentLinkRes?.checkoutUrl || returnUrl,
        qrCode: paymentLinkRes?.qrCode || null,
        orderCode,
        amount,
        description: truncatedDescription,
      },
    });
  } catch (error) {
    console.error(
      "\u274c Lỗi khi tạo thanh toán:",
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
      data: {
        ...order._doc, // đảm bảo có checkoutUrl, qrCode
      },
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
