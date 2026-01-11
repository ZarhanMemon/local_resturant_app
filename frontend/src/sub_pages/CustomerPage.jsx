import Navbar from "../components/Navbar.jsx";
import { getUserLocation } from "../libs/getUserLocation";
import { useState, useEffect, useRef } from "react";

import { useAuthStore } from "../context/useAuthStore.js";
import { useCustomerStore } from "../context/useCustomerStore.js";

import CategoryCard from "../components/CategoryCard.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import ItemCard from "../components/ItemCard.jsx";

const categories = [
  { category: "Snacks", image: "www.istockphoto.com" },
  { category: "Main Course", image: "www.istockphoto.com" },
  { category: "Pizza", image: "www.istockphoto.com" },
  { category: "Burgers", image: "stock.adobe.com" },
  { category: "Desserts", image: "www.pexels.com" },
  { category: "Chinese", image: "www.shutterstock.com" },
  { category: "Beverages", image: "www.istockphoto.com" },
  { category: "Salads", image: "www.pexels.com" },
  { category: "Sandwiches", image: "www.shutterstock.com" },
  { category: "Pasta", image: "www.istockphoto.com" },
  { category: "Vegan", image: "www.pexels.com" },
  { category: "Seafood", image: "www.shutterstock.com" },
  { category: "Sides", image: "www.istockphoto.com" },
  { category: "Others", image: "www.shutterstock.com" },
];

function CustomerPage() {
  const { authUser } = useAuthStore();
  const { restByCity, getRestaurantByCity } = useCustomerStore();

  const isCustomer = authUser?.role === "Customer";

  const [location, setLocation] = useState(
    isCustomer ? "Fetching location..." : ""
  );

  const categoryRef = useRef(null);
  const restaurantRef = useRef(null);
  const itemRef = useRef(null);

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  useEffect(() => {
    if (isCustomer) {
      getUserLocation()
        .then((data) => setLocation(data.city))
        .catch(() => setLocation("City"));
    }
  }, [isCustomer]);

  useEffect(() => {
    if (location) getRestaurantByCity(location);
  }, [location]);

  return (
    <div className="w-screen min-h-screen bg-[#fff9f6] mt-[90px] pb-10">
      <Navbar />

      {/* ================= CATEGORIES ================= */}
      <Section
        title="Inspiration for your first order"
        refEl={categoryRef}
        onLeft={() => scrollLeft(categoryRef)}
        onRight={() => scrollRight(categoryRef)}
      >
        {categories.map((cat, i) => (
          <CategoryCard key={i} data={cat} />
        ))}
      </Section>

      {/* ================= RESTAURANTS ================= */}
      <Section
        title={`Best Shop in ${location}`}
        refEl={restaurantRef}
        onLeft={() => scrollLeft(restaurantRef)}
        onRight={() => scrollRight(restaurantRef)}
      >
        {restByCity.map((rest) => (
          <RestaurantCard key={rest._id} data={rest} />
        ))}
      </Section>

      {/* ================= ITEMS ================= */}
      <Section
        title="Suggested Food items"
        refEl={itemRef}
        onLeft={() => scrollLeft(itemRef)}
        onRight={() => scrollRight(itemRef)}
      >
        {restByCity.flatMap((rest) =>
          rest.items?.map((item) => (
            <ItemCard key={item._id} data={item} />
          ))
        )}
      </Section>
    </div>
  );
}

export default CustomerPage;

/* ===================================================== */
/* ================= REUSABLE SECTION ================== */
/* ===================================================== */

function Section({ title, children, refEl, onLeft, onRight }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-3 mt-8">
      <h1 className="text-gray-800 text-2xl sm:text-3xl mb-3">{title}</h1>

      <div className="relative">
        {/* LEFT BUTTON */}
        <button
          onClick={onLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                     bg-white shadow-md w-10 h-10 rounded-full 
                     flex items-center justify-center text-2xl"
        >
          ‹
        </button>

        {/* SLIDER */}
        <div
          ref={refEl}
          className="flex gap-4 overflow-x-auto scroll-smooth 
                     scrollbar-hide px-12"
        >
          {children}
        </div>

        {/* RIGHT BUTTON */}
        <button
          onClick={onRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                     bg-white shadow-md w-10 h-10 rounded-full 
                     flex items-center justify-center text-2xl"
        >
          ›
        </button>
      </div>
    </div>
  );
}
