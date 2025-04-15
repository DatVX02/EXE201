import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminOverview: React.FC = () => {
  const { token } = useAuth();
  const [userCount, setUserCount] = useState<number>(0);
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [bookingCount, setBookingCount] = useState<number>(0);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://exe201-production.up.railway.app/api";

  const stats = [
    {
      title: "Tổng khách hàng",
      value: userCount,
      icon: <UserOutlined />,
      color: "#3f8600",
    },
    {
      title: "Tổng dịch vụ",
      value: serviceCount,
      icon: <AppstoreOutlined />,
      color: "#722ed1",
    },
    {
      title: "Lịch hẹn",
      value: bookingCount,
      icon: <ShoppingOutlined />,
      color: "#1890ff",
    },
    {
      title: "Doanh thu",
      value: paymentTotal,
      icon: <DollarOutlined />,
      suffix: "đ",
      color: "#cf1322",
    },
  ];

  useEffect(() => {
    const fetchUserCount = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, {
          headers: { "x-auth-token": token },
        });
        const users = res.data.filter((u: any) => u.role === "user");
        setUserCount(users.length);
      } catch (err) {
        console.error("❌ Lỗi khi lấy user:", err);
      }
    };

    const fetchServices = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/products`, {
          headers: { "x-auth-token": token },
        });
        setServiceCount(res.data.length);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dịch vụ:", err);
      }
    };

    const fetchPayments = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/payments`, {
          headers: { "x-auth-token": token },
        });

        const payments = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        const successPayments = payments.filter(
          (p: any) => p.status?.toLowerCase() === "success"
        );

        const total = successPayments.reduce((sum: number, p: any) => {
          const amount = Number(p.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        console.log("✅ Số đơn success:", successPayments.length);
        console.log("💰 Tổng doanh thu:", total.toLocaleString("vi-VN"));

        setPaymentTotal(total);
      } catch (err) {
        console.error("❌ Lỗi khi lấy payments:", err);
      }
    };

    const fetchBookings = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { "x-auth-token": token },
        });
        setBookingCount(res.data.length);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch hẹn (cart):", err);
      }
    };

    fetchUserCount();
    fetchServices();
    fetchPayments();
    fetchBookings();
  }, [token]);

  const chartData = stats.map((s) => ({ name: s.title, value: s.value }));

  return (
    <div>
      <Row gutter={16} className="mb-6">
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
                suffix={stat.suffix || ""}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Biểu đồ thống kê">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => value.toLocaleString("vi-VN")}
                />
                <Bar dataKey="value" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;
