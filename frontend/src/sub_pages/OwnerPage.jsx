import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useOwnerStore } from '../context/useOwnerStore';
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from '../components/ownerItemCard.jsx';

function OwnerPage() {

  const { myRestData, getRestaurant, deleteItem } = useOwnerStore();


  const navigate = useNavigate();

  useEffect(() => {
    getRestaurant();
  }, [getRestaurant]);



  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col">
      <Navbar myRestData={myRestData} />

      <div className="w-full flex flex-col items-center px-3 sm:px-6 pt-20 sm:pt-24 space-y-6 sm:space-y-8">

        {/* Header */}
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-700 text-center">
          Welcome to {myRestData?.name || "Your Restaurant"}
        </h1>

        {/* No restaurant */}
        {!myRestData && (
          <div className="w-full max-w-md sm:max-w-3xl">
            <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-100">
              <div className="flex flex-col items-center text-center space-y-4">
                <FaUtensils className="text-[#ff4d2d] w-14 h-14 sm:w-20 sm:h-20" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Add Your Restaurant
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Join our platform and start receiving orders.
                </p>
                <button
                  onClick={() => navigate("/create-edit-restaurant")}
                  className="w-full sm:w-auto bg-[#ff4d2d] text-white px-6 py-2 rounded-full font-medium"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant card */}
        {myRestData && (
          <div className="w-full max-w-md sm:max-w-3xl">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="relative h-40 sm:h-56"> {/* Parent defines the length/height */}
                <img
                  src={myRestData.image || "/fallback-restaurant.jpg"}
                  alt={myRestData.name}
                  className="w-full h-full object-cover" // Image fills the height perfectly
                />
                <button
                  onClick={() => navigate("/create-edit-restaurant")}
                  className="absolute top-3 right-3 bg-white/90 text-[#ff4d2d] p-2 rounded-full shadow"
                >
                  ✏️
                </button>
              </div>


              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {myRestData.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {myRestData.city}, {myRestData.state}
                </p>
                <p className="text-sm text-gray-500">{myRestData.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add food card */}
        {myRestData?.items?.length === 0 && (
          <div className="w-full max-w-md sm:max-w-3xl">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="bg-[#fff4f0] p-3 rounded-lg">
                    <FaUtensils className="text-[#ff4d2d] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold">
                      Add Your Food Item
                    </h4>
                    <p className="text-sm text-gray-500">
                      Start adding menu items.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/restaurant/add-item")}
                  className="w-full sm:w-auto bg-[#ff4d2d] text-white px-5 py-2 rounded-full"
                >
                  Add Food
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items list */}
        {myRestData?.items?.length > 0 && (
          <div className="w-full max-w-md sm:max-w-3xl">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h4 className="text-base sm:text-lg font-semibold mb-3">
                Your Food Items
              </h4>

              <div className="space-y-3">
                {myRestData.items.map((item) => (
                  <OwnerItemCard
                    key={item._id}
                    item={item}
                    onClick={() => navigate(`/restaurant/item/${item._id}`)}
                    onEdit={() =>
                      navigate(`/restaurant/edit-item/${item._id}`, {
                        state: { item },
                      })
                    }
                    onDelete={() => deleteItem(item._id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

}

export default OwnerPage;