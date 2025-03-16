import React, { useState } from "react";
import {
  HistoryOutlined,
  ScheduleOutlined,
  CustomerServiceOutlined,
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
    "Danh sách đơn hàng ",
    "/doctor_staff/list-of-assigned",
    <ScheduleOutlined />
  ),

  getItem(
    "Thực hiện dịch vụ",
    "/doctor_staff/perfom-service",
    <CustomerServiceOutlined />
  ),
  getItem(
    "Lịch sử đơn hàng",
    "/doctor_staff/service-history ",
    <HistoryOutlined />
  ),
];

const TherapistManagement: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminHeader />
      <Layout style={{ marginTop: "80px" }}>
        <Sider
          className='mt-5'
          theme='light'
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}>
          <div className='demo-logo-vertical' />
          <Menu defaultSelectedKeys={["1"]} mode='inline' items={items} />
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
