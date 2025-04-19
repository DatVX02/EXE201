const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  BookingID: {
    type: String,
    unique: true,
    required: true,
  },
  BookingCode: {
  type: String,
  required: true,
  unique: true,
},
  service_id: String,
  service_name: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String,
  username: String,
  quantity: Number,
  price: Number,
  paymentMethod: { type: String, default: "payos" },
  productType: { type: String, default: "purchase" },
  status: { type: String, default: "pending" },
  orderCode: String, // ✅ thêm trường mới
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);

// const mongoose = require("mongoose");

// const BookingSchema = new mongoose.Schema({
//   service_id: String,
//   service_name: String,
//   customerName: String,
//   customerEmail: String,
//   customerPhone: String,
//   username: String,
//   quantity: Number,
//   price: Number,
//   paymentMethod: { type: String, default: "payos" },
//   productType: { type: String, default: "purchase" },
//   status: { type: String, default: "pending" },
//   orderCode: String, // ✅ thêm trường mới
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Booking", BookingSchema);
