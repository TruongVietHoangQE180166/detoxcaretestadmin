import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, login } from "../services/auth/authService";
import { useToast } from "../components/common/ToastContext";
import { useUserStore } from "../store/userStore";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const setUser = useUserStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await login({ username, password });
            console.log("data res", data.data.accessToken);



            if (data.data.accessToken) {

                
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("userId", data.data.userId);
                localStorage.setItem("userName", data.data.userName);
                localStorage.setItem("email", data.data.email);
                const userResponse = await getUser(data.data.userId);
                console.log("userResponse", userResponse);
                // Set user data in Zustand store
                setUser({
                    userId: data.data.userId,
                    username: data.data.userName,
                    email: data.data.email,
                    role: userResponse.data.role,
                    status: userResponse.data.status,
                    accessToken: data.data.accessToken,
                });
                addToast("Login thành công!", "success");
                navigate("/dashboard");
            } else {
                addToast("Sai username hoặc mật khẩu hoặc bạn không có quyền ADMIN!", "error");
            }
        } catch (error: any) {
            console.error("Login failed:", error);

            if (error.response?.data?.message?.messageDetail) {
                addToast(`${error.response.data.message.messageDetail}`);
            } else {
                addToast("Đăng nhập thất bại, vui lòng thử lại!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
                    Admin Page Detox
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition duration-200"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition duration-200"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <br />
                    <span className="text-green-600 font-bold">
                        Contact with admin to get account
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
