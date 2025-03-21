import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../layout/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Service {
  _id: string;
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

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) fetchServiceDetail(id);
  }, [id]);

  const fetchServiceDetail = async (service_id: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${service_id}`
      );
      console.log("Dữ liệu chi tiết:", res.data); // 👈 Thêm dòng này
      setService(res.data);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết dịch vụ:", error);
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

  const handleCheckout = () => {
    addToCart();
    toast.success(`Đã thêm sản phẩm ${service?.name} giỏ hàng!`);
    setTimeout(() => {
      navigate("/cart");
    }, 1000);   
  };

  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = {
      _id: service?._id,
      name: service?.name,
      price: service?.price,
      image: service?.image,
      quantity: 1,
    };

    // Kiểm tra trùng ID thì tăng số lượng
    const index = currentCart.findIndex((p: any) => p._id === item._id);
    if (index > -1) {
      currentCart[index].quantity += 1;
    } else {
      currentCart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20 text-xl text-gray-600">
          Đang tải chi tiết...
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="text-center py-20 text-red-600">
          Không tìm thấy dịch vụ.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <img
            src={service.image || "/default-image.jpg"}
            alt={service.name}
            className="w-full h-64 object-cover rounded mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {service.name}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Giá:</strong> {formatPrice(service.price)}
          </p>
          <p className="text-lg text-gray-600 mb-2">
            <strong>Danh mục:</strong>{" "}
            {typeof service.category === "object"
              ? service.category.name
              : "Không xác định"}
          </p>

          <p className="text-md text-gray-700 mt-4 whitespace-pre-line">
            {service.description}
          </p>
          <button
            onClick={() => handleCheckout()}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetail;
