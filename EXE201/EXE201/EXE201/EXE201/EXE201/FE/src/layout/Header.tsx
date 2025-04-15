"use client";

import type React from "react";
import { useState, useEffect } from "react";
import "../../src/index.css";
import Logo from "../assets/logodiabecare_1.png";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Dropdown, Menu } from "antd";
import { ChevronDown, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCartOutlined } from "@ant-design/icons";

const Header: React.FC = () => {
  const [user, setUser] = useState<{ username: string; role?: string } | null>(
    null
  );
  const [role, setRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role || null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setRole(null);
    navigate("/login");
    toast.success("Đã đăng xuất thành công!");
  };

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    setLoadingSearch(true);
    try {
      const response = await fetch("https://exe201-production.up.railway.app/api/products/");
      const products = await response.json();

      const filtered = products.filter((product: any) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectProduct = (product: any) => {
    setSearchQuery("");
    setFilteredProducts([]);

    if (product.productType === "purchase") {
      navigate(`/booking_services/${product._id}`);
    } else if (product.productType === "consultation") {
      navigate(`/booking/${product._id}`);
    } else {
      toast.error("Loại sản phẩm không xác định!");
    }
  };

  const getDashboardLink = () => {
    const storedUser = localStorage.getItem("user");
    const userRole = storedUser ? JSON.parse(storedUser).role : null;

    switch (userRole) {
      case "admin":
        return "/admin";
      case "staff":
        return "/staff";
      case "skincare_staff":
        return "/therapist";
      case "user":
        return "/order_history";
      default:
        return "/order_history";
    }
  };

  const handleProfileClick = () => {
    navigate(getDashboardLink());
  };

  const storeMenu = (
    <Menu className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48">
      <Menu.Item key="booking">
        <Link
          to="/booking_services/booking"
          className="block px-4 py-2 text-gray-700 hover:bg-yellow-50"
        >
          Đặt hàng
        </Link>
      </Menu.Item>
      <Menu.Item key="services">
        <Link
          to="/booking_services/services"
          className="block px-4 py-2 text-gray-700 hover:bg-yellow-50"
        >
          Tư vấn
        </Link>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48">
      <Menu.Item
        key="dashboard"
        onClick={handleProfileClick}
        className="hover:bg-yellow-50"
      >
        <div className="px-4 py-2 flex items-center gap-2 text-gray-700">
          <User size={14} />
          <span>Lịch sử đặt hàng</span>
        </div>
      </Menu.Item>
      <div className="border-t border-gray-100 my-1"></div>
      <Menu.Item
        key="logout"
        onClick={handleLogout}
        className="hover:bg-yellow-50"
      >
        <div className="px-4 py-2 flex items-center gap-2 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Log Out</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-[#fff] text-black py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={Logo || "/placeholder.svg"}
              alt="LuLuSpa Logo"
              className="w-60 h-12 ml-20"
            />
          </Link>
        </div>

        <nav>
          <ul className="hidden md:flex space-x-8 text-lg font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-yellow-300 transition duration-300"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/booking_services/services"
                className="hover:text-yellow-300 transition duration-300"
              >
                Đặt lịch
              </Link>
            </li>
            <li>
              <Dropdown
                overlay={storeMenu}
                trigger={["hover"]}
                placement="bottomLeft"
              >
                <li
                  className="relative group cursor-pointer flex items-center gap-1 hover:text-yellow-300 transition duration-300"
                  onClick={() => navigate("/booking_services")}
                >
                  Cửa hàng <ChevronDown size={16} className="text-gray-600" />
                </li>
              </Dropdown>
            </li>

            <li className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="px-3 py-1.5 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm w-56"
                />
                {loadingSearch && (
                  <div className="absolute top-full left-0 mt-1 px-3 py-1 text-sm text-gray-500 bg-white rounded shadow w-full">
                    Đang tìm...
                  </div>
                )}
                {filteredProducts.length > 0 && (
                  <ul className="absolute z-50 bg-white border mt-1 left-0 rounded-md shadow-lg w-full max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <li
                        key={product._id}
                        onClick={() => handleSelectProduct(product)}
                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-sm"
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            to="/cart"
            className="hover:text-yellow-300 transition duration-300"
          >
            <ShoppingCartOutlined className="text-xl" />
          </Link>
          <div className="flex items-center space-x-2">
            {user ? (
              <Dropdown
                overlay={userMenu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="flex items-center gap-2 bg-yellow-300/20 hover:bg-yellow-300/30 text-black px-3 py-2 rounded-lg transition-all duration-200">
                  Welcome,
                  <span className="font-medium">{user.username}</span>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-yellow-300 transition duration-300"
                >
                  <span>Đăng nhập</span>
                </Link>
                <Divider type="vertical" className="border-black mt-1 h-7" />
                <Link
                  to="/register"
                  className="hover:text-yellow-300 transition duration-300"
                >
                  <span>Đăng ký</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <ToastContainer autoClose={3000} />
    </header>
  );
};

export default Header;
