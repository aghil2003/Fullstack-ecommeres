import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/axiosInstance";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    AxiosInstance.get(`/product/${id}`)
      .then((response) => {
        setProduct(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setError("The product you are looking for does not exist.");
      })
      .finally(() => setLoading(false));

    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to add items to the cart.",
      });
      return;
    }

    const cartItem = {
      userId,
      productId: product._id,
      size: selectedSize,
      quantity,
    };

    AxiosInstance.post("/cart", cartItem)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          text: "The product has been added to your cart successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Add",
          text: "Something went wrong. Please try again later.",
        });
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-red-600">Product Not Found</h1>
        <p className="text-gray-700 mt-2">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[400px] h-auto mx-auto mt-4 p-4 rounded-lg border border-gray-300 shadow-lg bg-white">
      <img
        src={product.productImage}
        alt={product.name}
        className="w-full h-[220px] object-cover rounded-lg shadow-md"
      />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
        <p className="text-lg font-medium text-blue-600">${product.price}</p>
      </div>
      <p className="text-gray-600 mt-2 text-sm">{product.description}</p>

      <div className="mt-4">
        <label className="block text-lg font-medium text-gray-700">Select Size:</label>
        <select
          className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="">Select Size</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="2XL">2XL</option>
          {product.sizes?.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-lg font-medium text-gray-700">Select Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        />
      </div>

      {!userId ? (
        <div className="mt-6 text-center">
          <p className="text-red-500 font-medium">Please log in to purchase this product.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="flex gap-4 mt-6">
          <button
            className={`w-1/2 py-2 px-4 rounded-lg text-lg font-medium transition ${
              selectedSize
                ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!selectedSize}
            onClick={() => {
              if (selectedSize) {
                navigate(`/checkout/${product._id}`, {
                  state: { size: selectedSize, quantity },
                });
              }
            }}
          >
            Buy Now
          </button>

          <button
            onClick={handleAddToCart}
            className={`w-1/2 py-2 px-4 rounded-lg text-lg font-medium transition ${
              selectedSize
                ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!selectedSize}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
