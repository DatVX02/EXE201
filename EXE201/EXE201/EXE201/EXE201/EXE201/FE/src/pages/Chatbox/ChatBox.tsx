import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";
import { Modal, Input, Button } from "antd";

interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string;
}

interface ChatBoxProps {
  cartId: string; // 👈 CartID từ đơn hàng đã đặt
  open: boolean;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ cartId, open, onClose }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const socket = useRef<any>(null);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://exe201-production.up.railway.app";

  const fetchMessages = async () => {
    if (!user?.username || !cartId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages?cartId=${cartId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
      });

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy tin nhắn:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const payload = {
      sender: user?.username,
      content: newMsg.trim(),
      cartId,
    };

    if (!payload.sender || !payload.cartId || !payload.content) {
      console.error("⚠️ Thiếu thông tin:", payload);
      alert("Thiếu thông tin người gửi, nội dung hoặc đơn hàng.");
      return;
    }

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

      if (!res.ok) {
        console.error("❌ Gửi lỗi:", data.message || data);
        return;
      }

      socket.current?.emit("send_message", payload);
      setMessages((prev) => [...prev, data]);
      setNewMsg("");
    } catch (err) {
      console.error("❌ Lỗi gửi tin nhắn:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.username, cartId]);

  useEffect(() => {
    if (!cartId) return;

    socket.current = io(API_BASE_URL);
    socket.current.on("receive_message", fetchMessages);

    return () => {
      socket.current?.disconnect();
    };
  }, [cartId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={sendMessage}
      footer={null}
      title="Chat với bác sĩ"
    >
      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50 rounded">
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
      <div className="flex mt-2">
        <Input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1"
          placeholder="Nhập tin nhắn..."
          onPressEnter={sendMessage}
        />
        <Button type="primary" onClick={sendMessage} className="ml-2">
          Gửi
        </Button>
      </div>
    </Modal>
  );
};

export default ChatBox;
