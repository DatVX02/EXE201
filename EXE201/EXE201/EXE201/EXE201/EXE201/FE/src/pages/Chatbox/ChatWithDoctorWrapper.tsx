import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ChatBoxT from "./ChatBoxT";

const ChatWithDoctorWrapper = () => {
  const { user, token } = useAuth();
  const [doctorUsername, setDoctorUsername] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://exe201-production.up.railway.app/api";

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!user?.username) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/cart/last-booked-doctor/${user.username}`,
          {
            headers: {
              "x-auth-token": token || "",
            },
          }
        );
        const data = await res.json();
        setDoctorUsername(data.doctorUsername);
        setCartId(data.cartId);
      } catch (error) {
        console.error("❌ Lỗi khi lấy bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [user?.username]);

  if (loading) return <p>Đang tải bác sĩ...</p>;
  if (!doctorUsername || !cartId)
    return <p>Bạn chưa đặt lịch với bác sĩ nào.</p>;

  return (
    <ChatBoxT
      doctorUsername={doctorUsername}
      cartId={cartId}
      open={true}
      onClose={() => {}}
    />
  );

};

export default ChatWithDoctorWrapper;
