import React, { useState } from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  OrderedListOutlined,
  LogoutOutlined,
  CalendarTwoTone,
  CalendarFilled,
  CalendarOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import CustomerProfile from "./Customer_profile";
import Layout from "../../layout/Layout";
import SettingPage from "../Home/Settingpage";
import Booking from "../Home/Booking";
import Customer_booking from "./Customer_booking";

// Dummy component cho Thông tin cá nhân
const ProfileInfo = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
    <p>Thông tin cá nhân sẽ được hiển thị tại đây.</p>
  </div>
);

export default function Customer_layout() {
  const [selectedKey, setSelectedKey] = useState("orders");

  const handleMenuClick = (e: any) => {
    if (e.key === "logout") {
      // 👉 Thực hiện logout hoặc chuyển trang
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else {
      setSelectedKey(e.key);
    }
  };

  // ✅ Nội dung chính theo menu
  const renderContent = () => {
    switch (selectedKey) {
      case "profile":
        return <SettingPage />;
      case "orders_services":
        return <CustomerProfile />;
      case "orders_booking":
        return <Customer_booking />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="h-[90vh] bg-white rounded shadow-lg overflow-hidden flex">
          {/* Sidebar bên trái */}
          <div className="w-64 border-r min-h-full">
            <div className="text-lg font-bold px-6 py-4 border-b">
              Tài khoản của tôi
            </div>
            <Menu
              mode="vertical"
              selectedKeys={[selectedKey]}
              onClick={handleMenuClick}
              className="border-0"
            >
              <Menu.Item key="profile" icon={<UserOutlined />}>
                Thông tin cá nhân
              </Menu.Item>
              <Menu.Item key="orders_services" icon={<CalendarOutlined />}>
                Lịch sử đặt lịch
              </Menu.Item>
              <Menu.Item key="orders_booking" icon={<ProfileOutlined />}>
                Lịch sử mua hàng
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined />}>
                Đăng xuất
              </Menu.Item>
            </Menu>
          </div>

          {/* Nội dung bên phải */}
          <div className="flex-1 p-6">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  );
}
