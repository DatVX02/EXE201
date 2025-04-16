import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Input, Button } from "antd";

interface Message {
  sender: string;
  receiver: string;
  cartId: string;
  content: string;
  timestamp?: string;
}

const DoctorChat: React.FC = () => {
  const { token, user } = useAuth();
  const { cartId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://exe201-production.up.railway.app";

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages?cartId=${cartId}`, {
        headers: {
          "x-auth-token": token || "",
        },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("❌ Lỗi lấy tin nhắn:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const latestUserMsg = messages
      .slice()
      .reverse()
      .find((msg) => msg.cartId === cartId);

    if (!latestUserMsg) {
      console.error("⚠️ Không tìm thấy khách hàng để gửi phản hồi.");
      return;
    }

    const payload = {
      sender: user?.username,
      receiver: latestUserMsg.sender,
      cartId,
      content: newMsg.trim(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        setNewMsg("");
      } else {
        console.error("❌ Gửi lỗi:", data.message || data);
      }
    } catch (err) {
      console.error("❌ Lỗi khi gửi phản hồi:", err);
    }
  };

  useEffect(() => {
    if (cartId) fetchMessages();
  }, [cartId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Chat với khách hàng - Đơn hàng {cartId}
      </h2>
      <div className="border rounded p-3 h-80 overflow-y-auto bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500 italic">Chưa có tin nhắn nào</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === user?.username ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                msg.sender === user?.username
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <p className="text-xs italic mb-1">{msg.sender}</p>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="flex mt-3">
        <Input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Nhập nội dung phản hồi..."
          className="flex-1"
        />
        <Button type="primary" onClick={sendMessage} className="ml-2">
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default DoctorChat;
