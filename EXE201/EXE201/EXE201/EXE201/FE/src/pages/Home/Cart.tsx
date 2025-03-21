import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";

interface CartItem {
  _id: string;
  name: string;
  price: number | { $numberDecimal: string };
  image?: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const formatPrice = (price: any): string => {
    let value = 0;
    if (typeof price === "object" && price?.$numberDecimal) {
      value = parseFloat(price.$numberDecimal);
    } else if (typeof price === "number") {
      value = price;
    }
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  };

  const increment = (index: number) => {
    const updated = [...cart];
    updated[index].quantity += 1;
    updateCart(updated);
  };

  const decrement = (index: number) => {
    const updated = [...cart];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      updateCart(updated);
    }
  };

  const removeItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    updateCart(updated);
  };

  const total = cart.reduce((acc, item) => {
    const price =
      typeof item.price === "object"
        ? parseFloat(item.price.$numberDecimal)
        : item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
          Giỏ hàng
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Giỏ hàng trống.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="p-4">Sản phẩm</th>
                    <th className="p-4">Giá</th>
                    <th className="p-4">Số lượng</th>
                    <th className="p-4">Tổng</th>
                    <th className="p-4 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => {
                    const unitPrice =
                      typeof item.price === "object"
                        ? parseFloat(item.price.$numberDecimal)
                        : item.price;
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <tr key={item._id} className="border-t">
                        <td className="p-4 flex items-center space-x-3">
                          <img
                            src={item.image || "/default-image.jpg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span>{item.name}</span>
                        </td>
                        <td className="p-4">{formatPrice(item.price)}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => decrement(index)}
                              className="bg-gray-300 px-2 py-1 rounded"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => increment(index)}
                              className="bg-gray-300 px-2 py-1 rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-800">
                          {formatPrice(itemTotal)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-8 text-xl font-bold text-gray-800">
              Tổng cộng: {total.toLocaleString("vi-VN")} VNĐ
            </div>

            <div className="text-right mt-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Tiến hành thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
