import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "../context/useAuthStore";
import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";

//firebase google auth helper
import { googleLogin as googlePopup } from "../libs/googleAuth.js";

const SignUpPage = () => {
  const { signup, isSigningUp , googleLogin } = useAuthStore();
  
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Customer",
  });

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.phone.trim()) return toast.error("Mobile number is required");
    if (formData.phone.length !== 10)
      return toast.error("Mobile number must be 10 digits");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6 && formData.password)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await signup(formData);
      if (success) {
        navigate("/");
      }
    }
  };

  // Google Signup Handler
  // 
  // Flow:
  // 1. Call googlePopup() to open Firebase Google sign-in popup
  // 2. User authenticates with Google account
  // 3. Firebase returns user object (name, email)
  // 4. Send user object to googleLogin() store action
  // 5. Store sends request to /auth/google endpoint
  // 6. Backend creates account (if new) or logs in (if exists)
  // 7. If successful, redirect to home page
  const handleGoogleSignup = async () => {
    try {
      // Open Firebase popup and wait for result
      const googleUser = await googlePopup(); // user detail from google

      const success = await googleLogin(googleUser);
      if (success) {
        navigate("/");
      }
    } catch {
      toast.error("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-orange-500">Chindi</h1>
          <p className="text-sm text-gray-500">
            Create your account to start ordering delicious food 🍔
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

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

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="9876543210"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
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

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Select Role
            </label>
            <div className="flex gap-2">
              {["Customer", "Admin", "Rider"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                    formData.role === role
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300 text-gray-600 hover:border-orange-400"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full rounded-lg bg-orange-500 py-2 text-white font-medium hover:bg-orange-600 transition disabled:opacity-60"
          >
            {isSigningUp ? "Creating account..." : "Create Account"}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          OR
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {/* Google */}
        <button 
        type="button"
          onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-1 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50">
          <FcGoogle size={20} />
          Continue with Google
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-orange-500 hover:text-orange-600 transition"
          >
            Sign in
          </Link>
        </p>{" "}
      </div>
    </div>
  );
};

export default SignUpPage;
