import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { Therapist, Booking } from "../../types/booking";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
  "checked-in": { bg: "bg-blue-100", text: "text-blue-800", icon: "✔" },
  completed: { bg: "bg-green-100", text: "text-green-800", icon: "✔" },
  "checked-out": { bg: "bg-purple-100", text: "text-purple-800", icon: "🚪" },
  cancel: { bg: "bg-red-100", text: "text-red-800", icon: "✖" },
} as const;

interface Message {
  cartId: string;
  content: string;
  sender: string;
  receiver: string;
  timestamp?: string;
}

const ListOfAssign: React.FC = () => {
  const { user, cart, setCart, fetchCart, loadingCart, cartError } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [latestMessages, setLatestMessages] = useState<Record<string, Message>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const navigate = useNavigate();
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://exe201-production.up.railway.app/api";

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  useEffect(() => {
    setBookings(cart);
  }, [cart]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `https://exe201-production.up.railway.app/api/messages`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("authToken") || "",
            },
          }
        );

        if (!res.ok) throw new Error("Không thể lấy dữ liệu tin nhắn");
        const data = await res.json();
        if (!Array.isArray(data))
          throw new Error("Dữ liệu tin nhắn không hợp lệ");

        const grouped: Record<string, Message> = {};
        data.forEach((msg: Message) => {
          const cartMatch = cart.some((b) => b.CartID === msg.cartId);
          const receiverMatch =
            msg.receiver?.toLowerCase() === user?.username?.toLowerCase();

          if (cartMatch && receiverMatch) {
            grouped[msg.cartId] = msg;
          }
        });

        setLatestMessages(grouped);
      } catch (err) {
        console.error("❌ Lỗi tải tin nhắn:", err);
      }
    };

    if (user?.username) {
      fetchMessages();
    }
  }, [cart, user]);

  const handleComplete = async (cartId: string) => {
    if (!cartId) {
      toast.error("Invalid CartID");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please log in to mark as complete.");

      const booking = bookings.find((b) => b.CartID === cartId);
      if (!booking) throw new Error("Booking not found.");
      if (booking.status !== "checked-in")
        throw new Error("Can only complete 'checked-in' bookings.");

      const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to mark as complete: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const updatedCart = await response.json();
      setBookings((prev) =>
        prev.map((b) =>
          b.CartID === cartId ? { ...b, ...updatedCart.cart } : b
        )
      );
      setCart((prev) =>
        prev.map((b) =>
          b.CartID === cartId ? { ...b, ...updatedCart.cart } : b
        )
      );
      toast.success("Booking marked as completed!");
      await fetchCart();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to complete: ${errorMessage}`);
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6">
        Lịch bác sĩ được giao
      </h1>
      {loadingCart ? (
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 mx-auto text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      ) : cartError ? (
        <p className="text-center text-red-600">{cartError}</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings assigned to you</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap sticky left-0 bg-gray-100 z-10">
                    Mã đơn hàng
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Tên khách hàng
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Tên dịch vụ
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Ngày đặt
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Thời gian bắt đầu
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                   Tổng (VND)
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Trạng thái
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Nhắn tin
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => {
                  const statusStyle =
                    statusStyles[booking.status] || statusStyles.pending;
                  const message = latestMessages[booking.CartID || ""];
                  return (
                    <tr
                      key={booking.CartID || Math.random().toString()}
                      className="hover:bg-gray-50 transition-colors duration-300"
                    >
                      <td className="py-2 px-4 border-b whitespace-nowrap sticky left-0 bg-white z-10">
                        {booking.BookingID || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {booking.customerName}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {booking.serviceName}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {booking.bookingDate}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {booking.startTime}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {booking.totalPrice?.toLocaleString("vi-VN") || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {statusStyle.icon} {booking.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap max-w-xs">
                        <button
                          onClick={() =>
                            navigate(`/doctor_staff/chat/${booking.CartID}`)
                          }
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Nhắn tin
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {booking.status !== "completed" ? (
                          <button
                            onClick={() => handleComplete(booking.CartID || "")}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Success
                          </button>
                        ) : (
                          <span className="text-gray-500 italic">
                            Đã hoàn tất
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`py-2 px-4 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition-all duration-300`}
            >
              Previous
            </button>
            <span className="py-2 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`py-2 px-4 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition-all duration-300`}
            >
              Next
            </button>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={fetchCart}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-all duration-300"
              disabled={loadingCart}
            >
              {loadingCart ? "Refreshing..." : "Refresh Bookings"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListOfAssign;
