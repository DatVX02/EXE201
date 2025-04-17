import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Layout from "../../layout/Layout";
import { Divider } from "antd";
import { Link } from "react-router-dom";

interface Service {
  _id: string;
  name: string;
  description: string;
  image?: string;
  price?: number | { $numberDecimal: string };
  category: {
    _id: string;
    name: string;
  };
  productType: "purchase" | "consultation";
}

interface Category {
  _id: string;
  name: string;
}

const Booking: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) => service.category?._id === selectedCategory
      );

      console.log("Filtered Services:", filtered); // Debug log

      setFilteredServices(filtered);
    }
  }, [selectedCategory, services]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <Layout>
      <div className="flex container mx-auto px-6 py-16">
        {/* Danh sách sản phẩm */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            Sản phẩm
          </h2>

          {loading ? (
            <div className="text-xl font-semibold text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center text-xl text-gray-500">
              Không có sản phẩm nào trong danh mục này.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredServices.map((service) => (
                <motion.div
                  key={service._id}
                  className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
                >
                  <Link
                    to={`/booking_services/${service._id}`}
                    className="w-full"
                  >
                    <img
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      src={service.image || "/default-image.jpg"}
                      alt={service.name}
                    />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      {service.name}
                    </h3>
                    <p className="font-semibold text-gray-800 mb-4">
                      {service.description}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {service.price
                        ? `${service.price.toLocaleString("vi-VN")} VNĐ`
                        : "Liên hệ"}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bộ lọc danh mục */}
        <div className="w-[22vw] h-[50vh] ml-8 bg-white p-2 rounded-lg shadow-lg border border-[#00B389]">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6 mt-2">
            Danh Mục Sản Phẩm
          </h3>
          <Divider />
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full px-6 py-2 text-lg font-semibold border-b ${
              selectedCategory === "all" ? "bg-[#00B389] text-white" : ""
            } rounded mb-4`}
          >
            Tất cả sản phẩm
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`w-full px-6 py-2 text-lg font-semibold border-b ${
                selectedCategory === category._id
                  ? "bg-[#00B389] text-white"
                  : ""
              } rounded mb-4`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
