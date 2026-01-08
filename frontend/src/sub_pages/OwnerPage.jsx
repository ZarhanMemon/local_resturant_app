import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useMyRestStore } from '../context/useMyRestStore';
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function OwnerPage() {

  const { myRestData, getRestaurant } = useMyRestStore();

  const navigate = useNavigate();

  useEffect(() => {
    getRestaurant();
  }, [getRestaurant]);


  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col'>
      <Navbar myRestData={myRestData} />
      <div className='w-full flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24 space-y-8'>
        {/* Header */}
        <h1 className='text-xl sm:text-2xl font-semibold text-gray-700'>
          Welcome to {myRestData?.name || 'Your Restaurant'}
        </h1>

        {/* When no restaurant: show prompt card */}
        {!myRestData && (
          <div className='w-full max-w-3xl'>
            <div className='bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
              <div className='flex flex-col items-center text-center space-y-6'>
                <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20' />
                <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>Add Your Restaurant</h2>
                <p className='text-gray-600 mb-4 text-sm sm:text-base'>Join our food delivery platform and start reaching more customers today!</p>
                <button
                  onClick={() => navigate("/create-edit-restaurant")}
                  className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant card when present */}
        {myRestData && (
          <div className='w-full max-w-3xl'>
            <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
              <div className='relative'>
                <img
                  src={myRestData.image || '/fallback-restaurant.jpg'}
                  alt={myRestData.name}
                  className='w-full h-56 object-cover'
                />
                <button
                  onClick={() => navigate('/create-edit-restaurant')}
                  className='absolute top-4 right-4 bg-white/90 text-[#ff4d2d] p-2 rounded-full shadow-md hover:opacity-90'
                  aria-label='Edit restaurant'
                >
                  ✏️
                </button>
              </div>

              <div className='p-6'>
                <h3 className='text-2xl font-bold text-gray-800'>{myRestData.name}</h3>
                <p className='text-sm text-gray-500 mt-2'>
                  {myRestData.city}, {myRestData.state}
                </p>
                <p className='text-sm text-gray-500 mt-1'>{myRestData.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Food card (below) */}
        <div className='w-full max-w-3xl'>
          <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='bg-[#fff4f0] p-4 rounded-lg'>
                <FaUtensils className='text-[#ff4d2d] w-8 h-8' />
              </div>
              <div>
                <h4 className='text-lg font-semibold'>Add Your Food Item</h4>
                <p className='text-sm text-gray-500'>Share your delicious creations with customers by adding them to the menu.</p>
              </div>
            </div>

            <div>
              <button
                onClick={() => navigate('/restaurant/add-item')}
                className='bg-[#ff4d2d] text-white px-4 py-2 rounded-full font-medium hover:bg-orange-600 transition'
              >
                Add Food
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerPage;