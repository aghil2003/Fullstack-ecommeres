
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/axiosInstance";
import { Heart } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { fetchWishlist} from "../redux/wishlistSlice";
import { useDispatch} from "react-redux";

export default function Trending() {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [userId, setUserId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    let userId=""
    const usertoken = Cookies.get("token");
    if ( usertoken) {
      try {
        const decodedToken = jwtDecode(usertoken);
        userId=(decodedToken.userId || decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    console.log(userId);
    
    AxiosInstance.get(`/trendingproduct?userId=${userId}`)
      .then((response) => {
        const fetchedProducts = response.data.products || response.data;
        console.log(fetchedProducts,"fetchedProducts");
        
        const likedState = {};
        const optionsState = {};
        
        fetchedProducts.forEach((product) => {
          likedState[product._id] = product.isLiked || false;
          optionsState[product._id] = { size: "", quantity: 1 };
        });

        setProducts(fetchedProducts);
        setLikedProducts(likedState);
        setSelectedOptions(optionsState);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId || decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const requireLogin = () => {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "You need to log in to perform this action.",
      showConfirmButton: true,
      confirmButtonText: "Login",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };
  
  const toggleLike = async (productId) => {
    if (!userId) {
      requireLogin();
      return;
    }
  
    const token = Cookies.get("token");
    const isLiked = likedProducts[productId];
  
    try {
      if (isLiked) {
        await AxiosInstance.delete(`/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId },
        });
      } else {
        await AxiosInstance.post(
          "/favorites",
          { userId, productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setLikedProducts((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
      dispatch(fetchWishlist());
    } catch (error) {
      console.error("Error updating favorite:", error.response?.data || error);
    }
  };
  
  const handleChange = (productId, field, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };
  
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);
  return (
    <div className="w-full bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Top Trending</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.slice(0, 6).map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                onClick={() => toggleLike(product._id)}
              >
                <Heart size={28} fill={likedProducts[product._id] ? "red" : "white"} stroke={likedProducts[product._id] ? "red" : "gray"} />
              </button>

              <img 
  src={product.productImage} 
  alt={product.name} 
  className="w-full h-52 object-cover rounded-md shadow-md" 
  onClick={() => navigate(`/product/${product._id}`)}
/>

              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-lg font-medium text-blue-600">${product.price}</p>
                <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
              </div>

              <div className="mt-4">
           <label className="block text-lg font-medium text-gray-700">Select Size:</label>
           <select
          className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          value={selectedOptions[product._id]?.size || ""}
          onChange={(e) => handleChange(product._id, "size", e.target.value)}
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
                  value={selectedOptions[product._id]?.quantity}
                  onChange={(e) => handleChange(product._id, "quantity", Number(e.target.value))}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>
              <button
  className={`mt-4 py-2 px-4 rounded-md w-full transition ${
    selectedOptions[product._id]?.size
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-400 text-gray-700 cursor-not-allowed"
  }`}
  onClick={() => {
    if (!userId) {
      requireLogin();
    } else if (!selectedOptions[product._id]?.size) {
      Swal.fire({
        icon: "warning",
        title: "Size Required",
        text: "Please select a size before proceeding.",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    } else {
      navigate(`/checkout/${product._id}`, {
        state: { 
          size: selectedOptions[product._id]?.size,
          quantity: selectedOptions[product._id]?.quantity 
        }
      });
    }
  }}
>
  Buy Now
</button>




            </div>
          ))
        ) : (
          <p className="text-black text-center w-full">Not Found</p>
        )}
      </div>
    </div>
  );
}