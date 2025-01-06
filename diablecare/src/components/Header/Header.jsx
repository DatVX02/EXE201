import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import logo from "../../assets/Logo.png";

const Header = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/">Trang chủ</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/about">Về chúng tôi</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/products">Sản phẩm</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/contact">Liên hệ</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#00B389] text-white shadow-lg">
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-16" />
        </Link>
      </div>

      <nav className="hidden md:flex space-x-6">
        <Link className="text-white hover:text-blue-300 transition duration-200" to="/">
          Trang chủ
        </Link>
        <Link className="text-white hover:text-blue-300 transition duration-200" to="/about">
          Về chúng tôi
        </Link>
        <Link className="text-white hover:text-blue-300 transition duration-200" to="/products">
          Sản phẩm
        </Link>
        <Link className="text-white hover:text-blue-300 transition duration-200" to="/contact">
          Liên hệ
        </Link>
      </nav>

      <div className="flex space-x-4">
        <Link to="/login">
          <Button type="default" className="text-black border-white">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
            Register
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
