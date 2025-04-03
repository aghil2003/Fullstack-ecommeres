import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { jwtDecode } from "jwt-decode"; 
import Cookies from "js-cookie"; 
import Swal from "sweetalert2";

export default function ProductsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get("token");
        const decodedToken = jwtDecode(token);
        let userId = decodedToken.userId || decodedToken.id;
        const response = await axiosInstance.get(`/products?category=${category}&user=${userId}`);
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleDelete = async (productId) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));

      // Show success alert
      Swal.fire({
        title: "Deleted!",
        text: "The product was removed from the list.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the product.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUpdate = async (productId) => {
    try {
      await axiosInstance.put(`/products/${productId}`, { price: updatedPrice });
      setProducts(products.map(product =>
        product._id === productId ? { ...product, price: updatedPrice } : product
      ));
      setEditingProductId(null);
      setUpdatedPrice("");

      // Show success alert
      Swal.fire({
        title: "Updated!",
        text: "The price was successfully updated.",
        icon: "success",
        confirmButtonText: "OK",
      });

    } catch (error) {
      console.error("Error updating product:", error);
      
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to update the product price.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="w-[100%]">
      <h2 className="text-2xl font-bold">
        {category === "men" ? "Men's Products" : "Women's Products"}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white w-[30%] h-[400px] p-4 shadow-lg rounded-lg flex flex-col justify-between relative"
            >
              <img
                src={product.productImage}
                alt={product.name}
                className="w-full h-[200px] mt-[30px] object-cover rounded-md cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              />

              <div>
                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                <p className="text-gray-700">price:{product.price}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>

              {editingProductId === product._id ? (
                <div className="mt-2">
                  <input
                    type="number"
                    value={updatedPrice}
                    onChange={(e) => setUpdatedPrice(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Enter new price"
                  />
                  <button
                    onClick={() => handleUpdate(product._id)}
                    className="mt-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition w-full"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex gap-[10px] mt-3">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition w-full"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setEditingProductId(product._id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition w-full"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-black text-center w-full">No products found.</p>
        )}
      </div>
    </div>
  );
}
