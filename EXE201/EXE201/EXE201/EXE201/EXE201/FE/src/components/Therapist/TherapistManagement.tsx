import React, { useState } from "react";
import {
  HistoryOutlined,
  ScheduleOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import AdminHeader from "../Admin/AdminHeader";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={key}>{label}</Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "Đơn hàng bác sĩ ",
    "/doctor_staff/list-of-assigned",
    <ScheduleOutlined />
  ),

  getItem("Cài đặt", "/doctor_staff/settings", <SettingOutlined />),
  // getItem(
  //   "Service History",
  //   "/doctor_staff/chat ",
  //   <HistoryOutlined />
  // ),
];

const TherapistManagement: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminHeader />
      <Layout style={{ marginTop: "80px" }}>
        <Sider
          className="mt-5"
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content style={{ margin: " 16px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default TherapistManagement;
