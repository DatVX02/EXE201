import React, { useState, useEffect } from "react";
import { Button, Input, Avatar, Spin, Upload } from "antd";
import { UploadOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://exe201-production.up.railway.app";

const SettingPage: React.FC = () => {
  const { token } = useAuth();
  const [user, setUser] = useState({
    username: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { "x-auth-token": token },
      });

      const avatarPath = response.data.avatar
        ? `${API_BASE_URL}${response.data.avatar}`
        : `${API_BASE_URL}/default-avatar.png`;

      setUser({
        username: response.data.username,
        email: response.data.email,
        avatar: avatarPath,
      });

      setPreviewAvatar(avatarPath);
    } catch {
      toast.error("Không thể lấy thông tin người dùng!");
    } finally {
      setLoading(false);
    }
  };

 const handleFileChange = async (file: File) => {
   if (file.size > 10 * 1024 * 1024) {
     toast.error("File quá lớn! Vui lòng chọn ảnh dưới 10MB.");
     return false;
   }

   // 👉 Hiển thị ảnh tạm ngay
   const reader = new FileReader();
   reader.onloadend = () => {
     setPreviewAvatar(reader.result as string);
   };
   reader.readAsDataURL(file);

   // 👉 Upload ngầm
   const formData = new FormData();
   formData.append("avatar", file);

   try {
     const response = await axios.put(
       `${API_BASE_URL}/auth/update-profile`,
       formData,
       {
         headers: {
           "x-auth-token": token,
           "Content-Type": "multipart/form-data",
         },
       }
     );

     const newAvatar = `${API_BASE_URL}${
       response.data.user.avatar
     }?t=${Date.now()}`;
     setUser((prev) => ({ ...prev, avatar: newAvatar }));

     // ❌ KHÔNG cập nhật previewAvatar ở đây
     // Vì ảnh preview đang là ảnh tạm, chưa cần thay đổi
     toast.success("Cập nhật ảnh thành công!");
   } catch {
     toast.error("Lỗi khi upload ảnh!");
   }

   return false;
 };


  const handleUpdateUser = async () => {
    if (!token) {
      toast.error("Chưa xác thực");
      return;
    }

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/update-profile`,
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Thông tin đã được cập nhật!");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          email: user.email,
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: { "x-auth-token": token },
        }
      );

      toast.success("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
    } catch {
      toast.error("Đổi mật khẩu thất bại!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    window.location.href = "/login";
  };

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <ToastContainer />
      <h2>Cài đặt tài khoản</h2>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar size={100} src={previewAvatar || user.avatar} />
      </div>

      <Upload
        showUploadList={false}
        beforeUpload={(file) => {
          const isImage = file.type.startsWith("image/");
          if (!isImage) {
            toast.error("Chỉ được phép upload ảnh!");
            return false;
          }

          handleFileChange(file);
          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
      </Upload>

      <div style={{ marginTop: 20 }}>
        <label>Tên người dùng</label>
        <Input
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />

        <label>Email</label>
        <Input
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <Button
          type="primary"
          onClick={handleUpdateUser}
          style={{ marginTop: 10 }}
        >
          Cập nhật thông tin
        </Button>
      </div>

      <label style={{ marginTop: 20, display: "block" }}>Mật khẩu cũ</label>
      <Input.Password
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <label>Mật khẩu mới</label>
      <Input.Password
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Button
        type="default"
        onClick={handleChangePassword}
        style={{ marginTop: 10 }}
      >
        Đổi mật khẩu
      </Button>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Button
          type="primary"
          danger
          onClick={handleLogout}
          icon={<LogoutOutlined />}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default SettingPage;
