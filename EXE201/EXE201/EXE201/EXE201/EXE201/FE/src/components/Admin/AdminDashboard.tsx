import React, { useState } from "react";
import {
  DashboardOutlined,
  UserOutlined,
  ReadOutlined,
  InboxOutlined,
  QrcodeOutlined,
  StarOutlined,
  QuestionOutlined,
  ProductOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";

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
  getItem("Tổng quát", "/admin", <DashboardOutlined />),
  getItem("Quản lý người dùng", "/admin/user-management", <UserOutlined />),
  getItem(
    "Quản lý dịch vụ",
    "/admin/service-management",
    <ProductOutlined />
  ),
  // getItem(
  //   "VoucherManagement",
  //   "/admin/voucher-management",
  //   <MoneyCollectOutlined />
  // ),

  getItem("Quản lý danh mục", "/admin/category-management", <ReadOutlined />),

  getItem("Quản lý bài viết", "/admin/blog-management", <InboxOutlined />),
  getItem("Quản lý thanh toán", "/admin/payment-management", <QrcodeOutlined />),
  getItem("Quản lý đánh giá", "/admin/rating-management", <StarOutlined />),
  getItem(
    "Cài đặt",
    "/admin/settings",
    <SettingOutlined />
  ),
];

const AdminDashboard: React.FC = () => {
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
          <Content style={{ margin: "16px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
