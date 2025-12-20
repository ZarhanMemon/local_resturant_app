import { useState } from "react";
import { Mail, Loader2, ArrowLeft, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../context/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOTP() {
  const { verifyOtp, isVerifyingOtp, resetFormData, setResetFormData } = useAuthStore();

  const navigate = useNavigate();

  // for getting email in this page from signin page autoly
  const location = useLocation();
  const initialEmail =(location && location.state && location.state.email) || resetFormData.email;

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOTP] = useState(resetFormData.otp);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }
    if (!otp.trim()) {
      return toast.error("OTP is required");
    }

    // Save email and otp to store
    setResetFormData({ email, otp });

    const success = await verifyOtp({ email, otp });
    if (success) {
      navigate("/reset-password", { state: { email, otp } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-orange-500">
            Verify OTP
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
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
                onChange={(e) => setOTP(e.target.value)}
              />
            </div>

            
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isVerifyingOtp}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-medium py-2.5 disabled:opacity-70"
          >
            {isVerifyingOtp ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Verify OTP...
              </>
            ) : (
              "Verify OTP"
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
            Back to forgot-password
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
