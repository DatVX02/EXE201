import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "antd";
import { Booking } from "../../types/booking";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerBooking: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = "https://exe201-production.up.railway.app/api";

  useEffect(() => {
    if (user?.username) {
      fetchBookings(user.username);
      const interval = setInterval(() => {
        fetchBookings(user.username);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchBookings = async (username: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/booking/user/${encodeURIComponent(username)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi không xác định.");
      }
      const filtered = data.data.filter(
        (item: Booking) => item.productType === "purchase"
      );
      setBookings(filtered);
    } catch {
      setError("Không thể tải dữ liệu lịch đặt.");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (orderCode: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/booking/update-by-order/${orderCode}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Lỗi cập nhật: ${response.status} - ${
            errorData.message || "Không rõ lỗi"
          }`
        );
      }

      toast.success("✅ Đã cập nhật trạng thái đơn hàng.");
      fetchBookings(user?.username || "");
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Lỗi cập nhật đơn hàng."}`);
    }
  };

  const calculateTotal = (): number => {
    return bookings
      .filter((item) => item.status === "checked-out")
      .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  };

  const formatTotal = (): string => {
    return `${calculateTotal().toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6">
        Lịch sử thanh toán
      </h1>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600">
          Không có lịch sử thanh toán.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left">Dịch vụ</th>
                  <th className="py-3 px-4 border-b text-left">Thời gian</th>
                  <th className="py-3 px-4 border-b text-left">Số lượng</th>
                  <th className="py-3 px-4 border-b text-left">Tổng tiền</th>
                  <th className="py-3 px-4 border-b text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {item.service_name}
                      <div className="text-xs text-gray-400">
                        Mã đơn: {item.orderCode || "N/A"}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">{item.quantity}</td>
                    <td className="py-2 px-4 border-b">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-0.5 rounded-full text-sm font-semibold ${
                          item.status === "checked-out"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status === "checked-out"
                          ? "Đã thanh toán"
                          : "Chờ xử lý"}
                      </span>
                      {/* {item.status === "pending" && (
                        <button
                          onClick={() =>
                            updateBookingStatus(item.orderCode, "checked-out")
                          }
                          className="ml-2 text-sm text-blue-600 underline hover:text-blue-800"
                        >
                          Đánh dấu đã thanh toán
                        </button>
                      )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-right">
            <p className="text-xl font-bold text-gray-800">
              Tổng cộng: {formatTotal()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerBooking;
