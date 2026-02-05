import React from 'react'
import { useCustomerStore } from '../context/useCustomerStore.js';

function CategoryCard({ data, onClick, active = false }) {

  const { getItemsByCategory } = useCustomerStore();

  const handleClick = () => {
    if (onClick) return onClick(data.category);
    return getItemsByCategory(data.category);
  };

  return (
    <div 
    onClick={handleClick}
    className={`w-[120px] h-[120px] relative md:w-[180px] md:h-[180px] rounded-2xl border-2 ${active ? 'ring-4 ring-[#ff4d2d] scale-105' : 'border-[#ff4d2d]'} shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow`}>

      <img 
      src={data.image} 
      alt={data.category} 
      className='w-full h-full object-cover transform hover:scale-110 transition-transform duration-300'
      />
      <div className='absolute bottom-0 w-full left-0 bg-[#ffffff96]
      bg-opacity-95 px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur'>
        {data.category}

      </div>

    </div>

  )
}

export default CategoryCard