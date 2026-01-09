import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const OwnerItemCard = ({ item, onClick, onEdit, onDelete }) => {
  const finalPrice =
    item.discountPercent > 0
      ? Math.round(item.price * (1 - item.discountPercent / 100))
      : item.price;

   

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm
                 hover:shadow-md hover:bg-gray-50 hover:scale-[1.01]
                 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img
            src={item.image || "/fallback-restaurant.jpg"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>


        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="text-md font-semibold truncate">
              {item.name}
            </h5>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-500 truncate">
              {item.category}
            </span>
          </div>

          <p className="text-sm text-gray-500 truncate max-w-[36ch] mt-1">
            {item.description}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.isVeg
                ? "text-emerald-700 bg-emerald-100"
                : "text-rose-700 bg-rose-100"
                }`}
            >
              {item.isVeg ? "Veg" : "Non-Veg"}
            </span>

            {item.discountPercent > 0 && (
              <span className="text-xs text-orange-500 font-medium">
                {item.discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">
        <div className="text-right">
          {item.discountPercent > 0 && (
            <div className="text-xs line-through text-gray-400">
              ₹{item.price}
            </div>
          )}
          <div className="text-lg font-bold text-orange-500">
            {(!finalPrice || isNaN(finalPrice)) ? "Free" : `₹${finalPrice}`}
          </div>



        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          {/* EDIT */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(item);
            }}
            className="bg-white border rounded-full p-2 text-gray-600
                 hover:bg-gray-100 hover:text-gray-900 transition"
            aria-label="Edit item"
          >
            <Pencil size={16} />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(item);
            }}
            className="bg-white border rounded-full p-2 text-rose-600
                 hover:bg-rose-50 hover:text-rose-700 transition"
            aria-label="Delete item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
