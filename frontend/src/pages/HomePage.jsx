import React from "react";
import { useAuthStore } from "../context/useAuthStore";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { logout, authUser, isCheckingAuth } = useAuthStore();

  const navigate = useNavigate();

  console.log(authUser.user)

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/signin", { replace: true });
  };
  if (isCheckingAuth) return <div className="p-6">Checking auth...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome{authUser?.name ? `, ${authUser.name}` : ""}
            </h2>
            {authUser?.email && (
              <p className="text-sm text-gray-500">{authUser.email}</p>
            )}
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add any home page content below */}
        <div className="mt-6 text-gray-700">You are now on the home page.</div>
      </div>
    </div>
  );
}

export default HomePage;
