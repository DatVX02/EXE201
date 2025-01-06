import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/Layer_1.png";

const Header = () => {
  return (
    <Header className="flex justify-between items-center p-2 bg-gray-800 text-white">
     //* Logo
      <div>
        <Link to="/">
          <img src={logo} alt="logo" className="w-20" />
        </Link>
      </div>

      //* Navigation
      <div>
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4 text-white">
            <li>
              <Link
                to="/"
                className="hover:text-blue-400 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-blue-400 transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-blue-400 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

//* Auth
      <div>
        <nav className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </nav>
      </div>
    </Header>
  );
};

export default Header;
