import React from "react";
import { useCustomerStore } from "../context/useCustomerStore.js";
import { Trash2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

function CartPage() {
    const {
        cartItems,
        increaseQty,
        decreaseQty,
        removeFromCart,
         getTotalAmount,
    } = useCustomerStore();

 

    const navigate = useNavigate();
    const totalAmount = getTotalAmount();

    return (
        <div className="w-screen min-h-screen bg-[#fff9f6] pt-[90px]">

            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 text-orange-500"
            >
                <ArrowLeft size={22} />
            </button>

            <div className="max-w-5xl mx-auto px-4 py-6">

                {/* TITLE */}
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Your Cart
                </h1>

                {/* EMPTY CART */}
                {cartItems.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        🛒 Your cart is empty
                    </div>
                )}

                {/* CART ITEMS */}
                <div className="flex flex-col gap-4">
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center shadow-sm"
                        >
                            {/* IMAGE */}
                            <img
                                src={item.image || "/fallback-food.jpg"}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />

                            {/* INFO */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-semibold text-gray-900">
                                        {item.name}
                                    </h2>

                                    {/* VEG / NON-VEG */}
                                    <span
                                        className={`w-3 h-3 rounded-full ${item.foodtype === "veg"
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                            }`}
                                    />
                                </div>

                                <p className="text-sm text-gray-500">
                                    ₹{item.price} × {item.quantity}
                                </p>

                                <p className="font-bold text-gray-900 mt-1">
                                    ₹{item.price * item.quantity}
                                </p>
                            </div>

                            {/* QTY CONTROLS */}
                            <div className="flex items-center border rounded-md overflow-hidden">
                                <button
                                    onClick={() => decreaseQty(item._id)}
                                    className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                                >
                                    −
                                </button>

                                <span className="px-3 text-sm font-semibold">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() => increaseQty(item._id)}
                                    className="px-3 py-1 bg-red-500 text-white hover:bg-red-600"
                                >
                                    +
                                </button>
                            </div>

                            {/* REMOVE */}
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="ml-3 text-gray-500 hover:text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* BILL SUMMARY */}
                {cartItems.length > 0 && (<>
                    <div className="mt-8 bg-white rounded-xl border p-5 shadow-sm">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className=" mt-4 p-4 bg-red-500  text-white py-3 rounded-lg
                                 font-semibold hover:bg-red-600 transition"
                        >
                            Proceed to Checkout
                        </button>

                    </div>
                </>
                )}
            </div>
        </div>
    );
}

export default CartPage;
