import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import layerImage from "../../assets/Logo.png"; 

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const validateUsername = (username) => username.trim() !== "";
    const validatePassword = (password) => password.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateUsername(username)) {
            toast.error(t("Username Empty"));
            return;
        }

        if (!validatePassword(password)) {
            toast.error(t("Password Short"));
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                "",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || t("LoginFailed"));
                return;
            }

            const data = await response.json();
            toast.success(data.message || t("LoginSuccess"));

            localStorage.setItem("username", username);

            if (data.role === "user") {
                navigate("/user-homepage");
            }
            if (data.role === "admin") {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(t("LoginFailed"));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-[92vh] flex items-center justify-center px-5 lg:px-0">
            <ToastContainer />
            <div className="flex justify-center flex-1 bg-white border shadow sm:rounded-lg">
                <div className="flex-1 hidden text-center md:flex ">
                    <img
                        src={layerImage}
                        alt="logo"
                        className="mt-10 w-[44rem] h-[44rem] rounded-lg justify-center items-center aspect-square"
                    />
                </div>

                <div className="p-4 lg:w-1/2 xl:w-1/2 sm:p-[11rem] md:w-1/3">
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-extrabold text-blue-900 xl:text-4xl">
                            Đăng nhập
                        </h1>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col flex-1 w-full max-w-xs gap-4 mx-auto mt-8"
                        >
                            <input
                                className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <div className="relative">
                                <input
                                    className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute text-gray-500 right-3 top-3"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center justify-center w-full py-4 mt-5 font-semibold tracking-wide text-gray-100 transition-all duration-300 ease-in-out rounded-lg focus:shadow-outline focus:outline-none ${loading
                                        ? "bg-gray-500"
                                        : "bg-blue-900 hover:bg-indigo-700"
                                    }`}
                            >
                                {loading ? "Đang xử lý..." : "Đăng nhập"}
                            </button>

                            <div className="mt-1 text-center">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-blue-900 hover:underline"
                                >
                                   Quên mật khẩu
                                </Link>
                            </div>

                            <p className="mt-6 text-xs text-center text-gray-600">
                                Bạn chưa có tài khoản{" "} -{" "}
                                <Link to="/register">
                                    <span className="font-semibold text-blue-900">
                                        Đăng ký
                                    </span>
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
