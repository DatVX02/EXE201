// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { Booking } from "../../types/booking";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from "framer-motion";

// const CheckOut: React.FC = () => {
//   const { cart, fetchCart, loadingCart, cartError, token } = useAuth();
//   const [paymentUrl, setPaymentUrl] = useState<string>("");
//   const [qrCode, setQrCode] = useState<string>("");
//   const API_BASE_URL = "http://localhost:5000/api";

//   useEffect(() => {
//     let isMounted = true;

//     const loadCart = async () => {
//       try {
//         await fetchCart();
//       } catch (error) {
//         console.error("Failed to load cart in CheckOut:", error);
//       }
//     };

//     if (token) {
//       loadCart();
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [fetchCart, token]);

//   const calculateTotal = (): number => {
//     return cart
//       .filter((item) => item.status === "checked-out")
//       .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
//   };

//   const formatTotal = (): string => {
//     const totalValue = calculateTotal();
//     return `${totalValue.toLocaleString("vi-VN")} VNĐ`;
//   };

//   // Vô hiệu hóa chức năng thanh toán trực tiếp
//   const handleCheckoutInfo = () => {
//     toast.info("Thanh toán chỉ có thể được thực hiện bởi staff tại quầy. Vui lòng liên hệ nhân viên!");
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <ToastContainer />
//       <h1 className="text-3xl font-bold text-center mb-6">Trang Thanh Toán</h1>
//       {loadingCart ? (
//         <p className="text-center text-gray-600">Đang tải giỏ hàng...</p>
//       ) : cartError ? (
//         <p className="text-center text-red-600">{cartError}</p>
//       ) : cart.filter((item) => item.status === "checked-out").length === 0 ? (
//         <p className="text-center text-gray-600">Không có mục nào ở trạng thái 'completed' để thanh toán.</p>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-3 px-4 border-b text-left">Service Name</th>
//                   <th className="py-3 px-4 border-b text-left">Date & Time</th>
//                   <th className="py-3 px-4 border-b text-left">Therapist</th>
//                   <th className="py-3 px-4 border-b text-left">Total Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart
//                   .filter((item) => item.status === "checked-out")
//                   .map((item, index) => (
//                     <tr key={item.CartID || index} className="hover:bg-gray-50">
//                       <td className="py-2 px-4 border-b">{item.serviceName}</td>
//                       <td className="py-2 px-4 border-b">
//                         {item.bookingDate} - {item.startTime}
//                       </td>
//                       <td className="py-2 px-4 border-b">{item.Skincare_staff || "N/A"}</td>
//                       <td className="py-2 px-4 border-b">
//                         {item.totalPrice?.toLocaleString("vi-VN") || "N/A"} VNĐ
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="mt-6 text-right">
//             <p className="text-xl font-bold text-gray-800">Tổng cộng: {formatTotal()}</p>
//           </div>
//           {/* <div className="mt-6 text-center">
//             <p className="text-lg text-gray-600">
//               Lưu ý: Thanh toán chỉ có thể được thực hiện bởi staff tại quầy. Vui lòng liên hệ nhân viên để hoàn tất.
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleCheckoutInfo}
//               className="mt-4 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg cursor-not-allowed"
//               disabled
//             >
//               Thanh toán (Chỉ tại quầy)
//             </motion.button>
//           </div> */}
//         </>
//       )}
//     </div>
//   );
// };

// export default CheckOut;

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaBan,
} from "react-icons/fa"; // Import icons

interface Payment {
  _id: string;
  orderCode: string;
  orderName: string;
  amount: number;
  description?: string;
  status: "pending" | "success" | "failed" | "cancelled";
  returnUrl?: string;
  cancelUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  error: number;
  message: string;
  data: Payment | Payment[];
}

const StaffCheckOut: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 15;
  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please log in to view payments.");
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to fetch payments: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }
      const data: ApiResponse = await response.json();
      if (!Array.isArray(data.data)) {
        console.error(
          "API did not return a valid array in 'data' field:",
          data
        );
        throw new Error("Invalid data format from API");
      }
      setPayments(data.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to load payment list."
      );
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };
  const updatePaymentStatus = async (
    orderCode: string,
    newStatus: "success" | "failed"
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to update payment status.");
        return;
      }

      const payment = payments.find((p) => p.orderCode === orderCode);
      if (!payment) {
        toast.error("Payment not found.");
        return;
      }

      if (payment.status !== "pending") {
        toast.error("Can only update payments with 'pending' status.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/payments/update/${orderCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to update payment: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const updatedPayment: ApiResponse = await response.json();
      const updatedPaymentData = Array.isArray(updatedPayment.data)
        ? updatedPayment.data[0]
        : updatedPayment.data;

      // Cập nhật lại danh sách payment
      setPayments((prev) =>
        prev.map((p) =>
          p.orderCode === orderCode
            ? { ...p, status: updatedPaymentData.status }
            : p
        )
      );

      toast.success(`✅ Payment marked as ${newStatus}!`);

      // ✅ Gọi thêm API cập nhật trạng thái booking liên quan
      if (newStatus === "success") {
        await fetch(`${API_BASE_URL}/booking/update-by-order/${orderCode}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "checked-out" }),
        });
        toast.success("✅ Booking updated to 'checked-out'");
      }
    } catch (error) {
      console.error("Error updating payment/booking:", error);
      toast.error(
        error instanceof Error
          ? `Update failed: ${error.message}`
          : "Update failed."
      );
    }
  };

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

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
        Staff Check-out Management
      </h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading data...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap sticky left-0 bg-gray-100 z-10">
                    Order Code
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Order Name
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Amount (VND)
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Description
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Action
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Created At
                  </th>
                  <th className="py-3 px-4 border-b text-left whitespace-nowrap">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-4 text-gray-600">
                      No payments available
                    </td>
                  </tr>
                ) : (
                  currentPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50 transition-colors duration-300"
                    >
                      <td className="py-2 px-4 border-b whitespace-nowrap sticky left-0 bg-white z-10">
                        {payment.orderCode}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {payment.orderName}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {payment.amount.toLocaleString("vi-VN")}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {payment.description || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                            payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : payment.status === "success"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {payment.status === "pending" && (
                            <FaHourglassHalf className="mr-1" />
                          )}
                          {payment.status === "success" && (
                            <FaCheckCircle className="mr-1" />
                          )}
                          {payment.status === "failed" && (
                            <FaTimesCircle className="mr-1" />
                          )}
                          {payment.status === "cancelled" && (
                            <FaBan className="mr-1" />
                          )}
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {payment.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                updatePaymentStatus(
                                  payment.orderCode,
                                  "success"
                                )
                              }
                              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-all duration-300 mr-2 whitespace-nowrap"
                            >
                              Mark Success
                            </button>

                            <button
                              onClick={() =>
                                updatePaymentStatus(payment._id, "failed")
                              }
                              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-all duration-300 whitespace-nowrap"
                            >
                              Mark Failed
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500">No Action</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {new Date(payment.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b whitespace-nowrap">
                        {new Date(payment.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
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
        </>
      )}
      <div className="text-center mt-6">
        <button
          onClick={fetchPayments}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Payments"}
        </button>
      </div>
    </div>
  );
};

export default StaffCheckOut;
