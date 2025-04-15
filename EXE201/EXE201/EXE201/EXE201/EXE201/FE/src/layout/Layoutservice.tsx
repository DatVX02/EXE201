import React from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layoutservice: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col justify-center items-center">
        <div className="flex justify-center space-x-4 mb-6">
          <a href="/booking">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
              Mua sản phẩm
            </button>
          </a>

          <a href="/services">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
              Tư vấn và đặt lịch
            </button>
          </a>
        </div>
        <div className="h-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layoutservice;
