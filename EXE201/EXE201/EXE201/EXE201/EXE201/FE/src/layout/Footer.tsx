import React from "react";
import { FaFacebookF, FaInstagram, FaSearch } from "react-icons/fa";
import Logo from "../assets/logodiabecare_12_1.png";
import { ChevronDown } from "lucide-react";
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#00B389] text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="ml-40 mr-10">
          <div className="flex items-center gap-2 mb-4">
            <img src={Logo} alt="DiabeCare" className="h-20 " />
          </div>
          <p className="text-base leading-relaxed mb-4 text-justify font-Nunito-Sans ">
            DiabeCare mong muốn trở thành nền tảng thông tin y khoa liên quan
            đến tiểu đường hàng đầu tại Việt Nam, giúp bạn đưa ra những quyết
            định đúng đắn liên quan về chăm sóc sức khỏe và hỗ trợ bạn cải thiện
            chất lượng cuộc sống.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span>Kết nối với chúng tôi</span>
            <a
              href="https://www.facebook.com/profile.php?id=61572026472325"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="text-white hover:text-gray-200" />
            </a>
            <a
              href="https://www.instagram.com/diabecare.vn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-white hover:text-gray-200" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end mr-20">
          <div className="relative w-full md:w-2/3 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm DiableCare"
              className="w-full px-4 py-2 pl-10 rounded-full text-sm text-gray-800"
            />
            <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          </div>
          <ul className="flex w-[27vw] justify-between text-white font-medium text-sm mr-2">
            <li className="hover:underline cursor-pointer">Trang chủ</li>
            <li className="hover:underline cursor-pointer">Đặt lịch</li>
            <li className="relative group cursor-pointer flex items-center hover:underline">
              Cửa hàng
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 text-white group-hover:rotate-180 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </li>
            <li className="hover:underline cursor-pointer">Tư vấn</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
