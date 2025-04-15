import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../layout/Layout";
import { useAuth } from "../../context/AuthContext";
import ServicePage from "./Servicepage";
import Servicepagebooking from "./Servicepagebooking";

interface Service {
  _id: string;
  service_id: number;
  name: string;
  description: string;
  image?: string;
  duration?: number;
  price?: number | { $numberDecimal: string };
  category: {
    _id: string;
    name: string;
    description: string;
  };
  productType: "purchase" | "consultation";
  createDate?: string;
  isRecommended?: boolean;
}

const BookingService: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://exe201-production.up.railway.app/api/products/");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: any): string => {
    let priceValue = 0;
    if (typeof price === "object" && price?.$numberDecimal) {
      priceValue = Number.parseFloat(price.$numberDecimal);
    } else if (typeof price === "number") {
      priceValue = price;
    } else if (typeof price === "string") {
      priceValue = Number.parseFloat(price.replace(/\./g, ""));
    }
    return `${priceValue.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
          Sản phẩm & Dịch vụ
        </h2>

        {loading ? (
          <div className="text-xl font-semibold text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : (
          <>
            {/* Sản phẩm */}
            <h3 className="text-3xl font-semibold mb-6 text-gray-700">
              Mua hàng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services
                .filter((service) => service.productType === "purchase")
                .map((service) => (
                  <motion.div
                    key={service._id}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      {service.name}
                    </h3>
                    <img
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      src={service.image || "/default-image.jpg"}
                      alt={service.name}
                    />
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {formatPrice(service.price)}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/booking_services/${service._id}`)
                      }
                      className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </button>
                  </motion.div>
                ))}
            </div>

            {/* Tư vấn */}
            <h3 className="text-3xl font-semibold mb-6 text-gray-700">
              Tư vấn
            </h3>
            <Servicepagebooking />
          </>
        )}
      </div>
    </Layout>
  );
};

export default BookingService;
