"use client";

import type React from "react";
import { useState, useEffect } from "react";
import "../../src/index.css";
import Logo from "../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Dropdown, Menu } from "antd";
import { ChevronDown, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header: React.FC = () => {
  const [user, setUser] = useState<{ username: string; role?: string } | null>(
    null
  );
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isShopDropdownVisible, setIsShopDropdownVisible] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role || null);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".shop-dropdown")) {
        setIsShopDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleBookNow = () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập trước khi đặt dịch vụ!");
      setTimeout(() => navigate("/login"), 3000);
    } else {
      navigate("/services");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setRole(null);
    navigate("/login");
    toast.success("Đã đăng xuất thành công!");
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
        return "/dashboard";
      default:
        return "/dashboard";
    }
  };

  const handleProfileClick = () => {
    console.log("User role from localStorage:", localStorage.getItem("user"));
    navigate(getDashboardLink());
  };

  const userMenu = (
    <Menu className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48">
      <Menu.Item
        key="dashboard"
        onClick={handleProfileClick}
        className="hover:bg-yellow-50"
      >
        <div className="px-4 py-2 flex items-center gap-2 text-gray-700">
          <User size={16} />
          <span>Hồ sơ</span>
        </div>
      </Menu.Item>
      <Menu.Item key="settings" className="hover:bg-yellow-50">
        <Link
          to="/settings"
          className="px-4 py-2 flex items-center gap-2 text-gray-700"
        >
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>Cài đặt</span>
        </Link>
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
          <span>Đăng xuất</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-[#00B389] text-black py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-3">
          <Link to="/">
            <img
              src={Logo || "/placeholder.svg"}
              alt="LuLuSpa Logo"
              className="w-16 h-16 rounded-full"
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
            <li className="relative shop-dropdown">
              <button
                onClick={() => setIsShopDropdownVisible(!isShopDropdownVisible)}
                className="hover:text-yellow-300 transition duration-300 focus:outline-none"
              >
                Cửa hàng
              </button>

              {/* Dropdown menu */}
              {isShopDropdownVisible && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/category1"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsShopDropdownVisible(false)}
                      >
                        Mua hàng
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsShopDropdownVisible(false)}
                      >
                        Đặt lịch tư vấn
                      </Link>
                    </li>
                    
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link
                to="/test"
                className="hover:text-yellow-300 transition duration-300"
              >
                Câu hỏi
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="hover:text-yellow-300 transition duration-300"
              >
                Tin tức
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowModal(true)}
                className="hover:text-yellow-300 transition duration-300"
              >
                Liên hệ
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            title="Book your appointment now"
            onClick={handleBookNow}
            className="hidden md:block bg-yellow-300 text-black py-2 px-6 rounded-lg shadow-md hover:bg-yellow-400 transition duration-100"
          >
            Đặt lịch
          </button>

          <div className="flex items-center space-x-2">
            {user ? (
              <Dropdown
                overlay={userMenu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="flex items-center gap-2 bg-yellow-300/20 hover:bg-yellow-300/30 text-black px-3 py-2 rounded-lg transition-all duration-200">
                  <div className="bg-yellow-300 rounded-full p-1.5">
                    <User size={16} className="text-black" />
                  </div>
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
                  <span>Đăng nhập </span>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            {/* Nút đóng modal */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-900"
            >
              ×
            </button>

            {/* Tiêu đề */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Thông tin liên hệ
            </h3>

            {/* Form */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên"
                className="p-2 border w-full rounded-md"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="p-2 border w-full rounded-md"
              />
              <button className="py-2 px-4 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition">
                Gửi yêu cầu
              </button>
            </form>

            {/* Thông tin LuLuSpa */}
            <div className="mt-6 text-left">
              <p className="text-gray-600 font-medium">
                🏡 Tên cửa hàng: <span className="font-semibold">Diable</span>
              </p>
              <p className="text-gray-600">
                📞 Số điện thoại:{" "}
                <span className="font-semibold">123-456-789</span>
              </p>
              <p className="text-gray-600">
                📧 Email: <span className="font-semibold">info@Diable.com</span>
              </p>
              <p className="text-gray-600">
                ⏰ Thời gian làm việc:{" "}
                <span className="font-semibold">
                  Thứ 2 - thứ 7, 9:00 - 17:30
                </span>
              </p>
              <a
                href="https://www.facebook.com/profile.php?id=61572026472325"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                🌐 Hoặc có thể liên hệ với chúng tôi qua Facebook
              </a>
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose={3000} />
    </header>
  );
};

export default Header;
