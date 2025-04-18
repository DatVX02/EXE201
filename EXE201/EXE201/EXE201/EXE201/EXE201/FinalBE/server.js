require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Routes
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
const messageRoutes = require("./routes/messageRoutes");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/", express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug: Check URI đúng chưa
console.log("🔗 Mongo URI:", process.env.MONGO_URI);

// Payment
app.use("/api/payments/webhook", webhookRoutes);
app.use("/api/payments", paymentRoutes);
// app.post("/create-payment-link", async (req, res) => {
//   const YOUR_DOMAIN = process.env.MONGO_URI || "http://localhost:5000";
//   const body = {
//     orderCode: Number(String(Date.now()).slice(-6)),
//     amount: 1000,
//     description: "Thanh toan don hang",
//     returnUrl: `${YOUR_DOMAIN}/success.html`,
//     cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
//   };

//   try {
//     const paymentLinkResponse = await payOS.createPaymentLink(body);
//     res.redirect(paymentLinkResponse.checkoutUrl);
//   } catch (error) {
//     console.error(error);
//     res.send("Something went wrong");
//   }
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/booking", book);

app.use("/api/messages", messageRoutes); 
// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

  io.on("connection", (socket) => {
    console.log("👤 Client connected:", socket.id);

    socket.on("send_message", (data) => {
      socket.broadcast.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("👋 Client disconnected:", socket.id);
    });
  });
app.use("/api/messages", require("./routes/messageRoutes"));
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});