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
  const { searchItems, searchQuery, items, allItems, getAllItems, restByCity, getRestaurantByCity, getItemsByCategory, getItemsByRestName, clearItems } = useCustomerStore();

  const isCustomer = authUser?.role === "Customer";

  const [location, setLocation] = useState(
    isCustomer ? "Fetching location..." : ""
  );

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeRestaurant, setActiveRestaurant] = useState(null);

  const categoryRef = useRef(null);
  const restaurantRef = useRef(null);
  const itemRef = useRef(null);

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const handleCategoryClick = async (category) => {
    // 2nd click /toggle off when same category clicked
    if (activeCategory === category) {
      setActiveCategory(null);
      try {
        await clearItems();
      } catch (err) {
        console.error('clearItems error', err);
      }
      return;
    }

    // 1st click on a category or click on a different category
    try {
      await getItemsByCategory(category);
      setActiveCategory(category);
      setActiveRestaurant(null);
      if (itemRef.current) itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('Error fetching category items:', err);
    }
  };

  // Restaurant click handler: toggle restaurant filter and show its items
  const handleRestaurantClick = async (resName) => {
    // toggle off
    if (activeRestaurant === resName) {
      setActiveRestaurant(null);
      try {
        await clearItems();
      } catch (err) {
        console.error('clearItems error', err);
      }
      return;
    }

    try {
      await getItemsByRestName(resName);
      setActiveRestaurant(resName);
      setActiveCategory(null);
      if (itemRef.current) itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('Error fetching restaurant items:', err);
    }
  };

  // Get user location on mount and fetch restaurants for that location 
  useEffect(() => {
    if (isCustomer) {
      getUserLocation()
        .then((data) => setLocation(data.address.city))
        .catch(() => setLocation("City"));
    }
  }, [isCustomer]);

  // Fetch restaurants for the user's city whenever location changes
  useEffect(() => {
    if (location) getRestaurantByCity(location);
  }, [location, getRestaurantByCity]);

  // Fetch all items on mount to have a ready reference for category filtering and to show in suggestions when no category is active
  useEffect(() => {
    if (!allItems || allItems.length === 0) getAllItems();
  }, [allItems, getAllItems]);

  return (
    <div className="w-screen min-h-screen bg-[#fff9f6] mt-[90px] pb-10">
      <Navbar />

      {/* ================= SEARCH RESULTS ================= */}
      {searchQuery && searchItems && searchItems.length > 0 && (
        <Section title={`Search results for "${searchQuery}"`} refEl={itemRef} onLeft={() => scrollLeft(itemRef)} onRight={() => scrollRight(itemRef)}>
          {searchItems.map((item) => (
            <ItemCard key={item._id} data={item} />
          ))}
        </Section>
      )}

      {/* ================= CATEGORIES ================= */}
      <Section
        title="Inspiration for your first order"
        refEl={categoryRef}
        onLeft={() => scrollLeft(categoryRef)}
        onRight={() => scrollRight(categoryRef)}
      >
        {categories.map((cat, i) => (
          <CategoryCard key={i} data={cat} onClick={handleCategoryClick} active={activeCategory === cat.category} />
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
          <RestaurantCard key={rest._id} data={rest} onClick={handleRestaurantClick} active={activeRestaurant === rest.name} />
        ))}
      </Section>

      {/* ================= ITEMS ================= */}
      <Section
        title={`Suggested Food items${activeCategory || activeRestaurant ? ` — ${activeCategory || activeRestaurant}` : ''}`}
        refEl={itemRef}
        onLeft={() => scrollLeft(itemRef)}
        onRight={() => scrollRight(itemRef)}
      >
        {items && items.length > 0 ? (
          items.map((item) => <ItemCard key={item._id} data={item} />)
        ) 
        :
         (activeCategory || activeRestaurant) ? (
          <div className="text-gray-500 p-4">No items found.</div>
        ) : (
          restByCity.flatMap((rest) => rest.items?.map((item) => <ItemCard key={item._id} data={item} />))
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
