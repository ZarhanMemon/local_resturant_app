import React, { useState } from "react";
import { Star } from "lucide-react";
import {FaCartPlus} from "react-icons/fa";

function ItemCard({ data }) {

  const [qty, setQty] = useState(0);


  if (!data) return null;

  const {
    name,
    image,
    price,
    discountPercent,
    isVeg,
    rating
  } = data;


  let finalPrice = price - (price * discountPercent) / 100;
  finalPrice =
    finalPrice <= 0 || isNaN(finalPrice)
      ? "Free"
      : `₹${Math.round(finalPrice)}`;

  return (
    <div className="w-[170px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

      {/* IMAGE */}
      <div className="relative h-28 bg-gray-100">

        <img
          src={image || "/fallback-food.jpg"}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* DISCOUNT BADGE */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px]
                           px-2 py-0.5 rounded-md">
            {discountPercent}% OFF
          </span>
        )}

        {/* VEG / NON-VEG DOT */}
        <span
          className={`absolute top-2 right-2 w-4 h-4 rounded-sm border
          flex items-center justify-center
          ${isVeg ? "border-green-600" : "border-red-600"}`}
        >
          <span
            className={`w-2 h-2 rounded-full
            ${isVeg ? "bg-green-600" : "bg-red-600"}`}
          />
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-2.5 flex flex-col gap-1">

        {/* NAME */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
          {name}
        </h3>

        {/* RATING */}
        {rating?.average > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {rating.average.toFixed(1)}
            </span>
            <span className="text-gray-400">
              ({rating.count || 0})
            </span>
          </div>
        )}

        {/* PRICE + QTY */}
        <div className="mt-1 flex items-center justify-between">

          {/* PRICE */}
          <div className="leading-tight">
            {discountPercent > 0 && (
              <p className="text-[11px] text-gray-400 line-through">
                ₹{price}
              </p>
            )}
            <span className="text-sm font-bold text-gray-900">
              {finalPrice}
            </span>
          </div>

          {/* QUANTITY CONTROLS */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setQty(Math.max(0, qty - 1))}
              className="px-2 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              −
            </button>

            <span className="px-2 text-xs font-semibold">
              {qty}
            </span>

            <button
              onClick={() => setQty(qty + 1)}
              className="px-2 py-0.5 text-sm text-white bg-red-500 hover:bg-red-600"
            >
              +
            </button>

            <button className="ml-1 mr-2">
              <FaCartPlus className="text-gray-700 hover:text-red-500" /> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
