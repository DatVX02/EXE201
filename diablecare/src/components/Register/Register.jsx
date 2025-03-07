import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo.png";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    account: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const validateForm = () => {
    if (!formData.account.trim()) {
      toast.error("Tên tài khoản không được để trống");
      return false;
    }

    if (!formData.fullname.trim()) {
      toast.error("Họ và tên không được để trống");
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://f171-2405-4803-c877-55b0-4cdd-7c2f-6b9d-c541.ngrok-free.app/api/auth/register",//api register
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: formData.account,
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: { roleID: 1, roleName: "user" },
          }),
        }
      );

      if (!response.ok) {
        toast.error("Đăng ký thất bại");
        return;
      }

      toast.success("Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Lỗi mạng, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[92vh] flex items-center justify-center px-5 lg:px-0">
      <ToastContainer />
      <div className="flex justify-center flex-1 bg-white border shadow sm:rounded-lg">
        <div className="flex-1 hidden text-center md:flex">
          <img
            src={logo}
            alt="Logo"
            className="mt-10 w-[44rem] h-[44rem] rounded-lg justify-center items-center aspect-square"
          />
        </div>
        <div className="p-4 lg:w-1/2 xl:w-1/2 sm:p-[7rem] ">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-extrabold text-blue-900 xl:text-4xl">
              Đăng ký
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 w-full max-w-xs gap-4 mx-auto mt-8"
            >
              <input
                className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                type="text"
                name="account"
                placeholder="Nhập tài khoản"
                value={formData.account}
                onChange={handleInputChange}
              />
              <input
                className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                type="text"
                name="fullname"
                placeholder="Nhập họ và tên"
                value={formData.fullname}
                onChange={handleInputChange}
              />
              <input
                className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <div className="relative">
                <input
                  className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute text-gray-500 right-3 top-3"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
              <input
                className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 mt-5 font-semibold text-gray-100 transition-all duration-300 rounded-lg ${
                  loading ? "bg-gray-500" : "bg-blue-900 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
              <p className="mt-6 text-xs text-center text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="font-semibold text-blue-900">
                  Đăng nhập
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
