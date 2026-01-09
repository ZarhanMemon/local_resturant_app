import { ArrowLeft } from "lucide-react";
import { FaUtensils } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useMyRestStore } from "../context/useMyRestStore.js";
import { useLocation } from "react-router-dom";

const AddItems = () => {
  const navigate = useNavigate();
  const { createItem, myRestData, getRestaurant, editItems } = useMyRestStore();

  // editing existing item
  const location = useLocation();
  const editItemData = location.state?.item;

  const isEditMode = Boolean(editItemData);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Snacks",
    price: "",
    isVeg: false,
    imageFile: null,
    discountPercent: "",
  });

  useEffect(() => {
    if (editItemData) {
      setForm({
        name: editItemData.name || "",
        description: editItemData.description || "",
        category: editItemData.category || "Snacks",
        price: editItemData.price || "",
        isVeg: editItemData.isVeg || false,
        imageFile: null, // we don’t auto-set file
        discountPercent: editItemData.discountPercent || "",
      });

      setImagePreview(editItemData.image || null);
    }
  }, [editItemData]);


  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🖼 Image handler
  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imageFile: file }));

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ensure restaurant exists for this owner
      if (!myRestData) {
        alert("You need to create a restaurant before adding items.");
        navigate('/create-edit-restaurant');
        return;
      }

      // build FormData for multipart upload
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('isVeg', form.isVeg);
      formData.append('discountPercent', form.discountPercent);
      if (form.imageFile) formData.append('image', form.imageFile);

      if (isEditMode) {
        await editItems(editItemData._id, formData);
      } else {
        const result = await createItem(formData);
        console.log("Item added:", result);

      }

      navigate(-1);
    } catch (err) {
      console.error("add item error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ensure we have restaurant data for this owner
    if (!myRestData) getRestaurant();
  }, [myRestData, getRestaurant]);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-orange-500"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
        <div className="flex justify-center mb-3">
          <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20" />
        </div>

        <h2 className="text-center text-xl font-semibold mb-6">
          {myRestData ? "Edit Item" : "Add Item"}
        </h2>


        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">Item Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm text-gray-600">Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
            />

            {imagePreview && (
              <div className="mt-2 flex justify-center">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
            >
              <option>Snacks</option>
              <option>Main Course</option>
              <option>Pizza</option>
              <option>Burgers</option>
              <option>Desserts</option>
              <option>Chinese</option>
              <option>Beverages</option>
              <option>Others</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* PRICE */}
            <div>
              <label className="text-sm text-gray-600">Price (₹)</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                required
                min="0"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>

            {/* DISCOUNT PERCENTAGE */}
            <div>
              <label className="text-sm text-gray-600">Discount (%)</label>
              <input
                name="discountPercent"
                value={form.discountPercent}
                onChange={handleChange}
                type="number"
                required
                min="0"
                max="100"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>
          </div>


          {/* VEG */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isVeg"
              checked={form.isVeg}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-600">Veg Item</label>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white rounded-lg py-2 font-medium hover:bg-orange-600 disabled:opacity-60"
          >
            {isEditMode ? "Edit Food Item" : "Add Food Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItems;
