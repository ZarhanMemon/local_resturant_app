import { useState } from "react";
import { Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../context/useAuthStore.js";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {
  const { resetPassword, isResettingPassword, resetFormData, setResetFormData } = useAuthStore();

  const navigate = useNavigate();

  // for getting email from verify-otp page automatically
  const location = useLocation();
  const initialEmail = (location && location.state && location.state.email) || resetFormData.email;
  const initialOTP = (location && location.state && location.state.otp) || resetFormData.otp;

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOTP);
  const [newPassword, setNewPassword] = useState(resetFormData.newPassword);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }
    if (!otp.trim()) {
      return toast.error("OTP is required");
    }
    if (!newPassword.trim()) {
      return toast.error("New password is required");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    // Save to store
    setResetFormData({ email, otp, newPassword });

    const success = await resetPassword({ email, otp, newPassword });
    if (success) {
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-orange-500">Reset Password</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {/* Email Field */}
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-2">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* OTP Field */}
            <label className="text-sm font-medium text-gray-700 mt-4 block">
              OTP
            </label>
            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="123456"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            {/* New Password Field */}
            <label className="text-sm font-medium text-gray-700 mt-4 block">
              New Password
            </label>
            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isResettingPassword}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-medium py-2.5 disabled:opacity-70"
          >
            {isResettingPassword ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"
          >
            <ArrowLeft size={16} />
            Back to Forgot password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
