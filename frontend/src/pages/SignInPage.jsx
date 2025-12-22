import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "../context/useAuthStore";
import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";

//firebase google auth helper
import { googleLogin as googlePopup } from "../libs/googleAuth.js";


const SignInPage = () => {
  const { login, isLoggingIn, resetFormData, setResetFormData, googleLogin } = useAuthStore();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: resetFormData.email || "",
    password: resetFormData.newPassword || "",
  });

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setResetFormData({ email: formData.email });

      const success = await login(formData);
      if (success) {
        navigate("/");
      }
    }
  };

  // Google Sign-In Handler
  //
  // Flow:
  // 1. Call googlePopup() to open Firebase Google sign-in popup
  // 2. User authenticates with their Google account
  // 3. Firebase returns user object (name, email)
  // 4. Send user object to googleLogin() store action
  // 5. Store sends request to /auth/google endpoint
  // 6. Backend finds existing account by email and logs in user
  // 7. If successful, redirect to home page
  //
  // Note: Same endpoint as signup - backend handles both flows
  const handleGoogleSignIn = async () => {
    try {
      // Open Firebase popup and wait for result
      const googleUser = await googlePopup(); // user detail from google

      const success = await googleLogin(googleUser);
      if (success) {
        navigate("/");
      }
    } catch {
      toast.error("Google signin failed");
    }
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
          {/*add the forget password and reset passs logic on this */}
          <p className=" text-sm text-gray-600">
            {" "}
            <Link
              to="/forgot-password"
              state={{ curr_email: formData.email }} // from this u can sen the parameter
              className="font-medium text-orange-500 hover:text-orange-600 transition"
            >
              Forgot Password?{" "}
            </Link>
          </p>{" "}
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
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-1 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50"
        >
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
