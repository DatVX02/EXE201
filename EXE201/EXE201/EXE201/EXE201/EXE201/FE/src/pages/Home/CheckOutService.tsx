import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";

interface CartItem {
  _id: string;
  name: string;
  price: number | { $numberDecimal: string };
  image?: string;
  quantity: number;
  productType?: string;
}

const CheckoutService: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const formatPrice = (price: any): string => {
    const value =
      typeof price === "object" && price?.$numberDecimal
        ? parseFloat(price.$numberDecimal)
        : price;
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  };

  const total = cart.reduce((acc, item) => {
    const price =
      typeof item.price === "object"
        ? parseFloat(item.price.$numberDecimal)
        : item.price;
    return acc + price * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    const username = localStorage.getItem("username"); // 👈 Lấy từ localStorage
    const orderCode = "ORDER_" + Date.now(); // sinh mã đơn tạm thời

    const cartWithInfo = cart.map((item) => ({
      service_id: item._id,
      service_name: item.name,
      customerName,
      customerEmail,
      customerPhone,
      username,
      quantity: item.quantity,
      price:
        typeof item.price === "object"
          ? parseFloat(item.price.$numberDecimal)
          : item.price,
      paymentMethod,
      productType: "purchase",
      orderCode,
    }));

    try {
      for (const item of cartWithInfo) {
        const response = await fetch(
          "https://exe201-production.up.railway.app/api/booking/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          }
        );

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
      }

      localStorage.removeItem("cart");
      alert("Đơn hàng đã được gửi thành công!");
      window.location.href = "/booking-history"; // hoặc redirect đến trang lịch sử
    } catch (error: any) {
      console.error("❌ Gửi đơn hàng thất bại:", error);
      alert(error.message || "Không thể gửi đơn hàng.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Thanh toán đơn hàng
        </h1>

        {/* Giỏ hàng */}
        <div className="bg-white border rounded-lg p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Sản phẩm trong giỏ
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng trống.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const price =
                  typeof item.price === "object"
                    ? parseFloat(item.price.$numberDecimal)
                    : item.price;
                const itemTotal = price * item.quantity;

                return (
                  <div
                    key={item._id}
                    className="flex justify-between border-b pb-4"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right font-semibold">
                      {formatPrice(itemTotal)}
                    </div>
                  </div>
                );
              })}
              <div className="text-right text-lg font-bold text-gray-800 pt-4">
                Tổng cộng: {formatPrice(total)}
              </div>
            </div>
          )}
        </div>

        {/* Form nhập thông tin */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 border rounded-lg shadow-md space-y-6"
        >
          <div>
            <label className="block font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Phương thức thanh toán
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">-- Chọn --</option>
              <option value="payos">PayOS</option>
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="bank">Chuyển khoản ngân hàng</option>
            </select>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutService;
