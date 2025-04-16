import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Avatar, Spin } from "antd";

interface Message {
  cartId: string;
  content: string;
  sender: string;
  receiver: string;
  timestamp?: string;
}

const DoctorChatList: React.FC = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://exe201-production.up.railway.app";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages`, {
          headers: { "x-auth-token": token || "" },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`❌ Lỗi API ${res.status}:`, errorText);
          return;
        }

        const data = await res.json();
        console.log("📥 Dữ liệu từ API:", data);

        // Đảm bảo data là mảng
        if (!Array.isArray(data)) {
          console.error("❌ API không trả về mảng:", data);
          return;
        }

        // Lọc theo receiver là username
        const filtered = data.filter(
          (msg: Message) =>
            msg.receiver?.toLowerCase() === user?.username?.toLowerCase()
        );

        // Gom theo cartId, lấy tin cuối mỗi cart
        const latestByCart = filtered.reduce(
          (acc: Record<string, Message>, msg) => {
            acc[msg.cartId] = msg;
            return acc;
          },
          {}
        );

        setMessages(Object.values(latestByCart));
      } catch (err) {
        console.error("❌ Lỗi khi tải tin nhắn:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username && user?.role === "skincare_staff") {
      fetchMessages();
    }
  }, [user, token]);

  if (user?.role !== "skincare_staff") {
    return (
      <p className="text-red-600">Bạn không có quyền truy cập khu vực này.</p>
    );
  }

  if (loading)
    return <Spin tip="Đang tải tin nhắn..." className="block mx-auto mt-10" />;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Tin nhắn từ khách hàng</h2>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">Không có tin nhắn nào.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer"
              onClick={() => navigate(`/doctor_staff/chat/${msg.cartId}`)}
            >
              <Avatar className="bg-blue-500 mr-3 uppercase">
                {msg.sender?.charAt(0) || "U"}
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{msg.sender}</div>
                <div className="text-sm text-gray-700 truncate">
                  {msg.content}
                </div>
              </div>
              {msg.timestamp && (
                <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                  {new Date(msg.timestamp).toLocaleDateString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorChatList;
