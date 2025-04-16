import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Booking } from "../../types/booking";

interface CheckoutModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  cart: Booking[];
  fetchCart: () => Promise<void>;
  loadingCart: boolean;
  cartError: string | null;
  paymentUrl: string;
  setPaymentUrl: (url: string) => void;
  qrCode: string;
  setQrCode: (code: string) => void;
  API_BASE_URL: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  showModal,
  setShowModal,
  cart,
  fetchCart,
  loadingCart,
  cartError,
  paymentUrl,
  setPaymentUrl,
  qrCode,
  setQrCode,
  API_BASE_URL,
}) => {
  const calculateTotal = (): number => {
    return cart
      .filter((item) => item.status === "completed")
      .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const formatTotal = (): string => {
    const totalValue = calculateTotal();
    return `${totalValue.toLocaleString("vi-VN")} VNĐ`;
  };

  const [showQrCode, setShowQrCode] = React.useState(false);

const handleCheckout = async () => {
  const checkedInItems = cart.filter((item) => item.status === "completed");
  if (checkedInItems.length === 0) {
    toast.error("Không có mục nào được chọn để thanh toán.");
    setShowModal(false);
    return;
  }

  const totalAmount = calculateTotal();
  const orderName = checkedInItems[0]?.serviceName || "Nhiều dịch vụ";
  let description = `Dịch vụ ${orderName.substring(0, 25)}`;
  if (description.length > 25) description = description.substring(0, 25);

  const returnUrl = "https://exe201-production.up.railway.app/success.html";
  const cancelUrl = "https://exe201-production.up.railway.app/cancel.html";

  try {
    const response = await fetch(`${API_BASE_URL}/payments/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: checkedInItems,
        amount: totalAmount,
        orderName,
        description,
        returnUrl,
        cancelUrl,
        paymentMethod: "payos",
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error !== 0 || !data.data) {
      throw new Error(`Lỗi API: ${data.message || "Lỗi không xác định"}`);
    }

    setPaymentUrl(data.data.checkoutUrl);
    setQrCode(data.data.qrCode);
    setShowQrCode(true); // ✅ Đảm bảo QR hiển thị
  } catch (error: any) {
    console.error("❌ Lỗi trong quá trình thanh toán:", error);
    toast.error("Khởi tạo thanh toán thất bại. Vui lòng thử lại.");
    setShowModal(false);
  }
};

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Vui lòng đăng nhập để xác nhận thanh toán.");

      await Promise.all(
        cart
          .filter((item) => item.status === "completed")
          .map((item) =>
            fetch(`${API_BASE_URL}/cart/${item.CartID}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify({ status: "checked-out", action: null }),
            }).then((res) => {
              if (!res.ok)
                throw new Error(
                  `Không thể cập nhật mục giỏ hàng ${item.CartID}`
                );
            })
          )
      );

      await fetchCart();
      setShowModal(false);
      toast.success("Thanh toán thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái giỏ hàng:", error);
      toast.error("Lỗi khi cập nhật trạng thái thanh toán.");
    }
  };

  React.useEffect(() => {
    if (showModal) {
      handleCheckout();
    }
  }, [showModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                Xác Nhận Thanh Toán
              </h3>

              {loadingCart ? (
                <p className="text-center text-gray-600">
                  Đang tải giỏ hàng...
                </p>
              ) : cartError ? (
                <p className="text-center text-red-600">{cartError}</p>
              ) : cart.filter((item) => item.status === "completed").length ===
                0 ? (
                <p className="text-center text-gray-600">
                  Không có mục nào để thanh toán.
                </p>
              ) : (
                <>
                  <ul className="space-y-4 max-h-[40vh] overflow-y-auto">
                    {cart
                      .filter((item) => item.status === "completed")
                      .map((item, index) => (
                        <li
                          key={item.CartID || index}
                          className="flex justify-between py-2 border-b last:border-b-0"
                        >
                          <div className="text-sm">
                            <p className="font-semibold text-gray-800">
                              {item.serviceName}
                            </p>
                            <p className="text-gray-600">
                              {item.bookingDate} - {item.startTime}
                            </p>
                            {item.Skincare_staff && (
                              <p className="text-gray-600">
                                ID Nhân viên: {item.Skincare_staff}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-gray-800 whitespace-nowrap">
                            {item.totalPrice?.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </li>
                      ))}
                  </ul>

                  <div className="mt-6 border-t pt-4">
                    <p className="text-right text-xl font-bold text-gray-800">
                      Tổng cộng: {formatTotal()}
                    </p>
                  </div>

                  {paymentUrl && (
                    <div className="mt-6 text-center">
                      {!showQrCode ? (
                        <p className="text-blue-600 underline text-sm text-center">
                          <button
                            onClick={() => setShowQrCode(true)}
                            className="text-blue-600 underline"
                          >
                            👉 Nhấn vào đây để mở link thanh toán nếu QR không
                            hoạt động
                          </button>
                        </p>
                      ) : (
                        <>
                          <p className="text-lg font-semibold mb-2">
                            Quét QR để thanh toán:
                          </p>
                          <img
                            src={qrCode}
                            alt="QR Code"
                            className="mx-auto max-w-[180px]"
                          />
                          <p className="mt-4 text-blue-600 text-sm text-center">
                            <a
                              href={paymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              👉 Nhấn vào đây để mở trang PayOS nếu muốn
                            </a>
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300 text-gray-800"
                    >
                      Hủy
                    </motion.button>
                    {/* <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePayment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Xác Nhận
                    </motion.button> */}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
