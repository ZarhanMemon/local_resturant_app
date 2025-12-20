import { useAuthStore } from "./context/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";

import HomePage from "./pages/HomePage.jsx";

import ForgotPassword from "./components/ForgotPassword.jsx";
import VerifyOTP from "./components/VerifyOTP.jsx";
import ResetPassword from "./components/ResetPassword.jsx";



import "./App.css";

function App() {
  const { authUser, authCheck, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        
        <Route path="/home" element={<HomePage />} />

      </Routes>
    </>
  );
}

export default App;
