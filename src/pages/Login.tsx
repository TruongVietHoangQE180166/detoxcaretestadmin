import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, login } from "../services/auth/authService";
import { useToast } from "../components/common/ToastContext";
import { useUserStore } from "../store/userStore";
import { Lock, User, LogIn } from "lucide-react";

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
            // First, call the login API to get the token
            const loginResponse = await login({ username, password });
            console.log("loginResponse", loginResponse);

            if (loginResponse.data.accessToken) {
                // Store the token and basic user info from login response
                sessionStorage.setItem("accessToken", loginResponse.data.accessToken);
                sessionStorage.setItem("userId", loginResponse.data.userId);
                sessionStorage.setItem("userName", loginResponse.data.username);  // Fixed: using username instead of userName
                sessionStorage.setItem("email", loginResponse.data.email);
                
                // Now use the token to call getUser API
                const userResponse = await getUser(loginResponse.data.userId);
                console.log("userResponse", userResponse);
                
                // Store the role from getUser response
                sessionStorage.setItem("role", userResponse.data.role);
                
                // Set user data in Zustand store with all information
                setUser({
                    userId: loginResponse.data.userId,
                    username: loginResponse.data.username,  // Fixed: using username instead of userName
                    email: loginResponse.data.email,
                    role: userResponse.data.role,
                    status: userResponse.data.status,
                    accessToken: loginResponse.data.accessToken,
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400 rounded-2xl mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500">
                        Admin Page Detox
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">
                                Need help?
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?
                        </p>
                        <p className="text-sm font-semibold text-green-400 mt-1">
                            Contact admin to get access
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Login;