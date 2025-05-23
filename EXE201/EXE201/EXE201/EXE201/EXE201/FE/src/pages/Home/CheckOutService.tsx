import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useAuth } from "../../context/AuthContext";

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
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useAuth();

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

    const cartWithType = cart.map((item) => ({
      ...item,
      productType: "purchase",
    }));
    const orderName = cartWithType.map((item) => item.name).join(", ");

    try {
      // 1. Tạo link thanh toán
      const response = await fetch(
        "http://localhost:5000/api/payments/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cartWithType,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            paymentMethod,
            orderName,
            description: orderName,
            returnUrl: "http://localhost:5000/success.html",
            cancelUrl: "http://localhost:5000/cancel.html",
            amount: total,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result?.data?.checkoutUrl) {
        alert(result.message || "Không thể tạo thanh toán.");
        return;
      }

      // 2. Gửi từng booking có username
      for (const item of cartWithType) {
        const bookingPayload = {
          service_id: item._id,
          service_name: item.name,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          username: user?.username || "",
          quantity: item.quantity,
          price: parseFloat(
            typeof item.price === "object"
              ? item.price.$numberDecimal
              : item.price.toString()
          ),
          paymentMethod,
          productType: item.productType,
          orderCode: result.data.orderCode, // ✅ thêm dòng này
        };

        await fetch("http://localhost:5000/api/booking/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingPayload),
        });
      }

      // 3. Xoá giỏ hàng và chuyển sang trang thanh toán
      localStorage.removeItem("cart");
      window.location.href = result.data.checkoutUrl;
    } catch (error) {
      console.error("❌ Lỗi gửi đơn hàng:", error);
      alert("Không thể xử lý đơn hàng.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
          Thanh toán đơn hàng
        </h1>

        <div className="bg-white border rounded-lg p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Sản phẩm trong giỏ hàng
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
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "/default-image.jpg"}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-700 font-semibold">
                        {formatPrice(itemTotal)}
                      </div>
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

        {/* Form thanh toán */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 space-y-6 border"
        >
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Phương thức thanh toán <span className="text-red-500">*</span>
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Chọn --</option>
              <option value="payos">PayOS</option>s{" "}
            </select>
          </div>

          <div className="text-right pt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
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
