import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../layout/Layout";
import { useAuth } from "../../context/AuthContext";

interface Service {
  _id: string;
  service_id: number;
  name: string;
  description: string;
  image?: string;
  duration?: number;
  price?: number | { $numberDecimal: string };
  category: { _id: string; name: string; description: string };
  productType: "purchase" | "consultation";
  isRecommended?: boolean;
}

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://exe201-production.up.railway.app/api/products/"
      );
      const filteredServices = response.data.filter(
        (service: Service) => service.productType === "consultation"
      );
      setServices(filteredServices.map(formatService));
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatService = (service: Service) => ({
    ...service,
    price: formatPrice(service.price),
  });

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

  const handleServiceClick = (serviceId: string) => {
    if (isAuthenticated) {
      navigate(`/booking/${serviceId}`);
    } else {
      navigate("/login", { state: { from: `/booking/${serviceId}` } });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
          Dịch vụ tư vấn
        </h2>

        {loading ? (
          <div className="text-xl font-semibold text-center text-gray-500">
            Đang tải dịch vụ...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <motion.div
                key={service._id}
                className="relative bg-white p-6 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleServiceClick(service._id)}
                onMouseEnter={() => setHoveredService(service._id)}
                onMouseLeave={() => setHoveredService(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {service.name}
                </h3>
                <img
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  src={service.image || "/default-image.jpg"}
                  alt={service.name}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/default-image.jpg")
                  }
                />
                <p className="text-lg font-bold text-gray-900 mb-2">
                  {formatPrice(service.price)}
                </p>

                <AnimatePresence>
                  {hoveredService === service._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center p-6 rounded-lg shadow-md"
                    >
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-md text-gray-700 line-clamp-3">
                        {service.description || "Không có mô tả."}
                      </p>
                      <p className="text-md">
                        Thời gian: {service.duration || "N/A"} phút
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(service.price)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServicePage;
