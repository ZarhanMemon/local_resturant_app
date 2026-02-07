import { useState, useEffect } from "react";
import { MapPin, Search, ShoppingCart, Plus, Logs } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/useAuthStore";
import { useCustomerStore } from "../context/useCustomerStore.js";
import { getUserLocation } from "../libs/getUserLocation";
import { useOrderStore } from "../context/useOrderStore.js";

const Navbar = ({ myRestData }) => {


  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const { getItemByName, clearItems } = useCustomerStore();

  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { cartItems} = useCustomerStore(); // Get cart items from the store 
  const { orders } = useOrderStore()        // for the owner that he have order from customer
  const { currentOrder} = useOrderStore(); // for notify rider he have the order to deliver

  const isCustomer = authUser?.role === "Customer";
  const isOwner = authUser?.role === "Admin" || authUser?.role === "Owner";
  const isRider = authUser?.role === "Rider";

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate("/signin");
  };

  const [location, setLocation] = useState(
    isCustomer ? "Fetching location..." : ""
  );


  useEffect(() => {
    if (isCustomer) {
      getUserLocation()
        .then((data) => {
          setLocation(data.address.city);
        })
        .catch(() => setLocation("City"));
    }
  }, [isCustomer]);

  

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO (COMMON) */}
          <Link to="/" className="text-2xl font-bold text-orange-500">
           Chindi
          </Link>

          {/* CUSTOMER DESKTOP SEARCH */}
          {isCustomer && (
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
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (v.length === 0) clearItems();
                    else{getItemByName(v);}
                  }} // live search (no debounce)
                />
              </div>
            </div>
          )}

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* CUSTOMER MOBILE SEARCH ICON */}
            {isCustomer && (
              <button
                className="md:hidden"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setShowProfile(false);
                }}
              >
                <Search size={20} />
              </button>
            )}

            {/* CUSTOMER CART */}
            {isCustomer && (
              <button className="relative" onClick={() => navigate("/cart")}>
                <ShoppingCart size={22} />
                <span className="absolute -right-2 -top-2.5 text-xs font-bold text-[#ff4d2d] rounded-full px-1.5 py-px">{cartItems.length}</span>
              </button>
            )}

            {/* CUSTOMER DESKTOP MY ORDERS */}
            {isCustomer && (
              <button
                onClick={() => navigate("/my-orders")}
                className="hidden relative md:block text-sm font-medium bg-orange-100 rounded-xl px-3 py-2 text-orange-500"
              >
                My Orders
              </button>
            )}

            {/* OWNER / ADMIN BUTTONS */}
            {isOwner && (
              <>
                {myRestData && (<button
                  onClick={() => navigate("/restaurant/add-item")}
                  className="
                  flex items-center gap-1.5 bg-orange-100 text-orange-500 rounded-full px-2.5 md:px-4 py-1.5 text-sm font-medium hover:bg-orange-200 transition">
                  <Plus size={22} />
                  <span className="hidden md:inline">Add Food Item</span>
                </button>)}


                <button
                  onClick={() => navigate("/my-orders")}
                  className="flex relative items-center gap-1.5 text-sm font-medium bg-orange-100 rounded-xl px-3 py-2 text-orange-500"
                >
                  <Logs size={16} />
                  <span className="hidden md:inline">My Orders</span>
                  <span className="absolute -right-2 -top-2 text-xs font-bold text-white rounded-full bg-[#ff4d2d] px-1.5 py-px">{orders.length}</span>
                </button>
              </>
            )}

            {/* Rider */}
            {isRider && (
              <button
                onClick={() => navigate("/my-orders")}
                className="flex relative items-center gap-1.5 text-sm font-medium bg-orange-100 rounded-xl px-3 py-2 text-orange-500"
              >
                <Logs size={16} />
                <span className="hidden md:inline">My Orders</span>
                <span className="absolute -right-2 -top-2 text-xs font-bold text-white rounded-full bg-[#ff4d2d] px-1.5 py-px">{(currentOrder) && (1)}</span>
              </button>
            )}

            {/* PROFILE (COMMON) */}
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
                    <p className="text-xs text-gray-500">{authUser?.role}</p>
                  </div>

                  {isCustomer && (
                    <button
                      onClick={() => navigate("/my-orders")}
                      className="md:hidden w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      My Orders
                    </button>
                  )}

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

      {/* CUSTOMER MOBILE SEARCH BAR */}
      {isCustomer && showSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center border rounded-full px-3 py-2 gap-2">
            <MapPin size={18} className="text-orange-500" />
            <span className="w-[60px] truncate text-sm text-gray-600">
              {location}
            </span>
            <span className="h-5 w-px bg-gray-300" />
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="search delicious food..."
              className="flex-1 text-sm outline-none"
              onChange={(e) => {
                const v = e.target.value.trim();
                if (v.length === 0 ) clearItems();
                else{getItemByName(v);}
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
