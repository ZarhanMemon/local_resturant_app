import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "../context/useAuthStore";
import toast from "react-hot-toast";

import { Link } from "react-router-dom";

const SignInPage = () => {
  const { login, isLoggingIn } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-orange-500">Vingo</h1>
          <p className="text-sm text-gray-500">
           Sign In to your account to start ordering delicious food 🍔
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
           

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

         
          {/* Submit */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-lg bg-orange-500 py-2 text-white font-medium hover:bg-orange-600 transition disabled:opacity-60"
          >
            {isLoggingIn ? "Sign In..." : "Sign In"}
          </button>
        </form>


        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          OR
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full flex items-center justify-center gap-1 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50">
          <FcGoogle size={20} />
          Continue with Google
        </button>
        <p className="text-center text-sm text-gray-600">
          Create an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-orange-500 hover:text-orange-600 transition"
          >
            Sign up
          </Link>
        </p>{" "}
      </div>
    </div>
  );
};

export default SignInPage;
