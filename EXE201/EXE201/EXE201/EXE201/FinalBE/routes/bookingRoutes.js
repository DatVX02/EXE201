const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/create", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.get("/user/:username", bookingController.getBookingByUsername);
router.get("/purchases/:username", bookingController.getUserPurchases);
router.put("/:id/status", bookingController.updateBookingStatus);
router.get(
  "/by-order-code/:orderCode",
  bookingController.getBookingsByOrderCode
);
router.put(
  "/update-by-order/:orderCode",
  bookingController.updateBookingStatusByOrderCode
); // ✅ mới thêm

module.exports = router;
