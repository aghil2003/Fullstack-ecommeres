import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/axiosInstance";
import Swal from "sweetalert2";

function AddProductModal({ onClose }) {
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("image", productImage);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);

      const response = await AxiosInstance.post("/trendingproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Product added:", response.data);

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "New product was added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/dashbord");
        onClose();
      });

    } catch (error) {
      console.error("Error adding product:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to add product. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-red-500 text-2xl">
            &times;
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Product Image</label>
            <input
              type="file"
              className="w-full border p-2 rounded"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product Preview"
                className="mt-2 w-full h-40 object-cover rounded"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Category</label>
            <select
              className="w-full border p-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
