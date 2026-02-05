import { useAuthStore } from "./context/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";

import HomePage from "./pages/HomePage.jsx";
import CreateEditRestaurant from "./components/CreateEditRestaurant.jsx";
import AddItems from "./components/AddItem.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import ForgotPassword from "./components/ForgotPassword.jsx";
import VerifyOTP from "./components/VerifyOTP.jsx";
import ResetPassword from "./components/ResetPassword.jsx";

import CartPage from "./components/CartPage.jsx";
import CheckOut from "./components/CheckOut.jsx";
import OrderDone from "./components/OrderDone.jsx";
import MyOrders from "./components/MyOrders.jsx";
import UsersTrackingOrder from "./components/UsersTrackingOrder.jsx";

import "./App.css";

function App() {
  const { authUser, authCheck, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/signin"
          element={!authUser ? <SignInPage /> : <Navigate to="/" replace />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-edit-restaurant" element={<CreateEditRestaurant />} />
          <Route path="/restaurant/add-item" element={<AddItems />} />
          <Route path="/restaurant/edit-item/:itemId" element={<AddItems />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/order-done" element={<OrderDone/>}/>
          <Route path="/my-orders" element={<MyOrders/>} />
          <Route path="/tracking-order/:orderId" element={<UsersTrackingOrder/>} />


          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
