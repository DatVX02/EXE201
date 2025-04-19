const nodemailer = require("nodemailer");
require("dotenv").config();

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Hàm gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async (email, order) => {
  const mailOptions = {
    from: `"Diabecare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Xác nhận đơn hàng của bạn",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); background-color: #fff;">
            <h2 style="color: #4CAF50; text-align: center;">💆 Xác Nhận Đơn Hàng 💆</h2>
            <p style="font-size: 16px;">Xin chào <strong>${order.customerName
      }</strong>,</p>
            <p style="font-size: 16px;">Đơn hàng của bạn đã được xác nhận với mã <strong style="color: #FF5722;">${order.BookingID
      }</strong>.</p>

            <h3 style="border-bottom: 2px solid #4CAF50; padding-bottom: 5px;">🔹 Thông tin đơn hàng 🔹</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Dịch vụ:</strong> ${order.serviceName
      } (${order.serviceType})</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Ngày đặt:</strong> ${order.bookingDate
      }</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Giờ bắt đầu:</strong> ${order.startTime
      }</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Giờ kết thúc:</strong> ${order.endTime
      }</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nhân viên:</strong> ${order.Skincare_staff || "Chưa xác định"
      }</li>
                <li style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #E91E63;">
                  <strong>Tổng tiền:</strong> ${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      })
        .format(order.totalPrice)
        .replace("₫", "VNĐ")}
</li>
            </ul>

            <p style="color: #f44336; font-weight: bold; text-align: center; font-size: 16px;">
                ⏳ Vui lòng đến đúng giờ để nhận dịch vụ tốt nhất. ⏳
            </p>
            <p style="text-align: center;">Cảm ơn bạn đã tin tưởng sử dụng dịch vụ! 💖</p>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href='http://localhost:3000/dashboard' style="text-decoration: none;">
                    <button style="background-color: #4CAF50; color: white; padding: 12px 24px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer;">
                        Xem dịch vụ đã đặt
                    </button>
                </a>
            </div>
        </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Email xác nhận đơn hàng đã được gửi thành công!");
  } catch (error) {
    console.error("❌ Lỗi gửi email đơn hàng:", error);
  }
};

const sendBookingConfirmationEmail = async (email, order) => {
  const mailOptions = {
    from: `"Diabecare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Xác nhận đơn hàng của bạn",
    html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  <h2 style="color: #4CAF50; text-align: center; margin-bottom: 24px;">💆 XÁC NHẬN ĐƠN HÀNG 💆</h2>

  <p style="font-size: 16px; margin-bottom: 10px;">
    Xin chào <strong style="color: #333;">${order.customerName}</strong>,
  </p>

  <p style="font-size: 16px; margin-bottom: 20px;">
    Cảm ơn bạn đã đặt hàng dịch vụ <strong style="color: #3f51b5;">${order.serviceName
      }</strong>.
  </p>

  <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 8px 0;"><strong>Mã đơn hàng:</strong> <span style="color: #FF5722;">${order.BookingID
      }</span></p>
    <p style="margin: 8px 0;"><strong>Số điện thoại:</strong> ${order.customerPhone
      }</p>
    <p style="margin: 8px 0;"><strong>Địa chỉ:</strong> ${order.customerAddress || "Chưa cung cấp"
      }</p>
    <p style="margin: 8px 0;"><strong>Phương thức thanh toán:</strong> ${order.paymentMethod
      }</p>
    <p style="margin: 8px 0;"><strong>Số lượng:</strong> ${order.quantity}</p>
    <p style="margin: 8px 0;"><strong>Giá:</strong> ${order.price} VNĐ</p>
  </div>

  <p style="color: #f44336; font-weight: bold; text-align: center; font-size: 16px; margin-bottom: 24px;">
    ⏳ Vui lòng đến đúng giờ để nhận dịch vụ tốt nhất ⏳
  </p>

  <p style="text-align: center; font-size: 16px; color: #555;">
    Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.<br/>
    <strong>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ!</strong> 💖
  </p>

  <div style="text-align: center; margin-top: 30px;">
    <a href="http://localhost:3000/order_history" style="text-decoration: none;">
      <button style="background-color: #4CAF50; color: white; padding: 12px 24px; font-size: 16px; border: none; border-radius: 6px; cursor: pointer;">
        Xem đơn hàng
      </button>
    </a>
  </div>
</div>

      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Email xác nhận đơn hàng đã được gửi thành công!");
  } catch (error) {
    console.error("❌ Lỗi gửi email đơn hàng:", error);
  }
};

module.exports = { sendOrderConfirmationEmail, sendBookingConfirmationEmail };
