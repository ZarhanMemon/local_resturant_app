import { useState, useEffect } from "react";
import { MapPin, Search, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/useAuthStore";

import { getUserLocation } from "../libs/getUserLocation";

const Navbar = () => {
  
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // TEMP: later this will come from cart store
  const cartCount = 2;

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate("/signin");
  };

  const [location, setLocation] = useState(
    localStorage.getItem("location") || "City"
  );

  useEffect(() => {
    if (!localStorage.getItem("location")) {
      getUserLocation()
        .then((data) => {
          setLocation(data.city);
          localStorage.setItem("location", data.city);
        })
        .catch(() => setLocation("City"));
    }
  }, []);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-orange-500">
            Vingo
          </Link>

          {/* DESKTOP SEARCH + LOCATION */}
          <div className="hidden md:flex flex-1 mx-6">
            <div className="flex items-center w-full border-orange-200 border-2 rounded-xl px-3 py-2 gap-3">
              <MapPin size={16} className="text-orange-500" />
              <span className="w-[60px] truncate text-sm text-gray-600">
                {location}
              </span>
              <span className="h-5 w-px bg-gray-300" />

              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="search delicious food..."
                className="flex-1 text-sm outline-none"
              />
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* MOBILE SEARCH ICON */}
            <button
              className="md:hidden"
              onClick={() => {
                setShowSearch(!showSearch);
                setShowProfile(false);
              }}
            >
              <Search size={20} />
            </button>

            {/* CART ICON WITH COUNT */}
            <button className="relative" onClick={() => navigate("/cart")}>
              <ShoppingCart size={23} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2  text-orange-500 font-bold text-xs w-4 h-4  flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* DESKTOP MY ORDERS */}
            <button
              onClick={() => navigate("/orders")}
              className="hidden md:block text-sm font-medium bg-orange-100 rounded-xl p-2 text-orange-500"
            >
              My Orders
            </button>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowSearch(false);
                }}
                className="w-9 h-9 rounded-full bg-orange-500 text-white font-semibold flex items-center justify-center"
              >
                {authUser?.name?.charAt(0).toUpperCase()}
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">{authUser?.name}</p>
                  </div>

                  {/* MOBILE MY ORDERS */}
                  <button
                    onClick={() => navigate("/orders")}
                    className="md:hidden w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center border rounded-full px-3 py-2 gap-2">
            <MapPin size={20} className="text-orange-500" />
            <span className="w-[60px] truncate text-sm text-gray-600">
              {location}
            </span>

            <span className="h-5 w-px bg-gray-300" />

            <Search size={20} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="search delicious food..."
              className="flex-1 text-sm outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
