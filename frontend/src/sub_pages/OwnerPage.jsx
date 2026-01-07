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

  console.log(myRestData);

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col'>
      <Navbar myRestData={myRestData} />

      <div className='w-full flex justify-center px-4 sm:px-6 pt-8 sm:pt-12'>
        {!myRestData && (
          <div className='flex justify-center items-center h-100'>
            <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8 sm:p-12 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
              <div className='flex flex-col items-center text-center space-y-6'>
                <FaUtensils className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20' />
                <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>Add Your Restaurant</h2>
                <p className='text-gray-600 mb-4 text-sm sm:text-base'>Join our food delivery platform and start reaching more customers today!</p>
                <button 
                onClick={()=>navigate("/create-edit-restaurant")}
                className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200'>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerPage;