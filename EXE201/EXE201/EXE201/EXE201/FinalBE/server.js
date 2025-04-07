require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/auth");
const voucherRoutes = require("./routes/voucherRoutes");
const userRoutes = require("./routes/userRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const payOS = require("./utils/payos");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const questionRoutes = require("./routes/questionRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const blogRoutes = require("./routes/blogRoutes");
const book = require("./routes/bookingRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/", express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// payment
app.use("/api/payments/webhook", webhookRoutes);
app.use("/api/payments", paymentRoutes);
app.post("/create-payment-link", async (req, res) => {
  const YOUR_DOMAIN = "http://localhost:5000";
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 1000,
    description: "Thanh toan don hang",
    returnUrl: `${YOUR_DOMAIN}/success.html`,
    cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    res.redirect(paymentLinkResponse.checkoutUrl);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
});

//user
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//product
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
//voucher
app.use("/api/vouchers", voucherRoutes);
//cart
app.use("/api/cart", cartRoutes);
//review
app.use("/api/reviews", reviewRoutes);
//question
app.use("/api/questions", questionRoutes);
//blog
app.use("/api/blogs", blogRoutes);
//rating 
app.use("/api/ratings", ratingRoutes);
//booking
app.use("/api/booking", book);

// Connect DB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB Connection Error:", err));
// const mongoose = require("mongoose");


// require("dotenv").config();

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("❌ ERROR: MONGO_URI is not defined. Check your .env file.");
//   process.exit(1); // Dừng server nếu thiếu URI
// }

// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Error:", err);
//     process.exit(1); // Dừng server nếu kết nối thất bại
//   });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://localhost:<8BBNv9kAtmub7UnU>@cluster0.ugfmrlv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  // Loại bỏ các tùy chọn deprecated
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((error) => {
  console.log('MongoDB connection error:', error);
});
