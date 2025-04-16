import React from "react";
import { useParams } from "react-router-dom";
import ChatBoxT from "./ChatBoxT";
import { useAuth } from "../../context/AuthContext";

const ChatPage: React.FC = () => {
  const { cartId } = useParams();
  const { user } = useAuth();

  if (!cartId || !user?.username) return <p>Không tìm thấy cuộc trò chuyện.</p>;

  return (
    <ChatBoxT
      cartId={cartId}
      doctorUsername={user.username}
      open={true}
      onClose={() => {}}
    />
  );
};

export default ChatPage;
