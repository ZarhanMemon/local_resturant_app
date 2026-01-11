import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useOwnerStore } from "../context/useOwnerStore.js";
import { useAuthStore } from "../context/useAuthStore";
import { getUserLocation } from "../libs/getUserLocation";

const CreateEditRestaurant = () => {
  const navigate = useNavigate();
  const { myRestData, createEditRest } = useOwnerStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    city:  "",
    state: "",
    address: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (myRestData) {
      setForm((f) => ({
        ...f,
        name: myRestData.name || "",
        city: myRestData.city || f.city,
        state: myRestData.state || f.state,
        address: myRestData.address || f.address,
      }));
      if (myRestData.image) {
        setImagePreview(myRestData.image);
      }
    }
  }, [myRestData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((s) => ({ ...s, imageFile: file }));
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(myRestData?.image || null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("address", form.address);
      formData.append("owner", user?._id);
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }
      
      await createEditRest(formData);
      navigate(-1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation()
      .then((data) => {
        setForm((f) => ({
          ...f,
          address: data.address,
          city: data.city,
          state: data.state,
        }));
      })
      .catch((err) => {
        console.error("location error:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-orange-500 hover:opacity-70"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
        <div className="flex justify-center mb-3">
          <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20" />
        </div>

        <h2 className="text-center text-xl font-semibold mb-6">
          {myRestData ? "Edit Restaurant" : "Add Restaurant"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter Shop Name"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Shop Image</label>
            <input
              name="image"
              onChange={handleFile}
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
            />

            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Shop Preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              type="text"
              placeholder="Enter Shop Address"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white rounded-lg py-2 font-medium hover:bg-orange-600 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditRestaurant;