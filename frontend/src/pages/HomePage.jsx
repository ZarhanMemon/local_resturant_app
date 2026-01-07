import React from "react";
import { useAuthStore } from "../context/useAuthStore";
// import { useNavigate } from "react-router-dom";

import CustomerPage from "../sub_pages/CustomerPage.jsx";
import RiderPage from "../sub_pages/RiderPage";
import OwnerPage from "../sub_pages/OwnerPage";

function HomePage() {
  const { authUser, isCheckingAuth } = useAuthStore();

  // const navigate = useNavigate();
  // const handleLogout = async () => {
  //   const ok = await logout();
  //   if (ok) navigate("/signin", { replace: true });
  // };
  
  if (isCheckingAuth) return <div className="p-6">Checking auth...</div>;

  return (
    <>
      <div className="w-[100vw] min-h-[100vh] tp-[100px] flex flex-col items-center bg-[#fff9f6]">
        {authUser.role === "Customer" && <CustomerPage />}

        {authUser.role === "Rider" && <RiderPage />}

        {authUser.role === "Admin" && <OwnerPage />}
      </div>
    </>
  );
}

export default HomePage;
