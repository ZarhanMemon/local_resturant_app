import Navbar from "../components/Navbar.jsx";
import { getUserLocation } from "../libs/getUserLocation";
import { useState, useEffect, useRef } from "react";

import { useAuthStore } from "../context/useAuthStore.js";
import { useCustomerStore } from "../context/useCustomerStore.js";

import CategoryCard from "../components/CategoryCard.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import ItemCard from "../components/ItemCard.jsx";


const categories = [
  { 
    category: "Snacks", 
    image: "https://media.gettyimages.com/id/1149135424/photo/group-of-sweet-and-salty-snacks-perfect-for-binge-watching.jpg?s=170667a&w=gi&k=20&c=DIlQCPeRER4D5jNQYQRPyssTwpsd9QzCjdnU5nN6ah8=" 
  },
  { 
    category: "Main Course", 
    image: "data:image/jpeg;base64,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" 
  },
  { 
    category: "Pizza", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQycAi9xvU83r-qHuFJpSmcD3j9zyoqG_mFLUiojcNWo3wFgiwGrGUWIY2c1Ndu1k_7qLtvjPXOXoPbIB8fmB7q4XS75lB_0TKzC6OoHduEag&s=10" 
  },
  { 
    category: "Burgers", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOyKyIzjVv6I7sgm1auWa5lg15jSGl76QsG1iSqTcgIKAt6sABcP0_XUxTlGJRBM_VRzlNanIAY5yQJQBRItpdacy9EJz8pmu_IXRQMayB&s=10" 
  },
  { 
    category: "Desserts", 
    image: "https://lh3.googleusercontent.com/gps-proxy/ALd4DhH4qOoxJf1l6KFH-5NdgOmvoZJtUP3tqjpEG8cHFbevEj2FrLUnrYSe1ju3w1Tglu1kjhHbMGTbRIJw7OqIMHqjls1mablZkfaqt5Wr9iAIGB5ZN1TOXPo35CAI03-dSkMNOj7N0t67AEztuID0J9ws5TKtaEwWl03dQXuBn2kHQS54swwS8hmu=w137-h137-n-k-no" 
  },
  { 
    category: "Chinese", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ87X1J2F3j7K1f8g0q5v4l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z" 
  },
  { 
    category: "Beverages", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL5rWTZ8lzLX2yAHqzuAndtDtIVrtLNjTGOYUChSyWoIHIWzNu8CNhB42sGZU-6fRzvy0mxR15cemI5joWNGEu1I-jNFIjQYTWSOZEsSvh0w&s=10" 
  },
  { 
    category: "Salads", 
    image: "https://lh3.googleusercontent.com/p/AF1QipMe-n3231gy0vHCJvBUVIV_mYTUng9lf9jJLOE1=w110-h110-n-k-no" 
  },
  { 
    category: "Sandwiches", 
    image: "data:image/jpeg;base64,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" 
  },

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
