import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { Heart } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { fetchWishlist} from "../redux/wishlistSlice";
import { useDispatch} from "react-redux";

export default function ProductsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId || decodedToken.id;
  console.log(userId,"userId");
   

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/products/${userId}?category=${category}`)
        console.log(response.data,"response.data");
        
        setProducts(response.data);

        if (userId) {
          const likedState = response.data.reduce((acc, product) => {
            acc[product._id] = product.isLiked;
            return acc;
          }, {});
          console.log( likedState," likedState");
          
          setLikedProducts(likedState);
        }
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, userId]);

  const toggleLike = async (productId) => {
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to like this product.",
        showConfirmButton: true,
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
  
    const isLiked = likedProducts[productId];
  
    setLikedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  
    try {
      const token = Cookies.get("token"); 
      if (isLiked) {
        await axiosInstance.delete(`/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId },
        });
      } else {
        await axiosInstance.post(
          "/favorites",
          { userId, productId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      dispatch(fetchWishlist());
    } catch (error) {
      console.error("Error updating favorite:", error.response?.data || error);
  
      setLikedProducts((prev) => ({
        ...prev,
        [productId]: isLiked,
      }));
    }
  };
  
  return (
    <div className="w-[100%]">
      <h2 className="text-2xl font-bold">
        {category === "men" ? "Men's Products" : "Women's Products"}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-4 w-[90%] m-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white w-[30%] h-[400px] p-4 shadow-lg rounded-lg flex flex-col justify-between relative"
            >
              <button
                className="absolute top-2 right-2 p-1 rounded-full shadow-md hover:text-red-500 transition"
                onClick={() => toggleLike(product._id)}
              >
                <Heart
                  size={24}
                  fill={likedProducts[product._id] ? "red" : "none"}
                  stroke={likedProducts[product._id] ? "red" : "gray"}
                />
              </button>

              <img
                src={product.productImage}
                alt={product.name}
                className="w-full h-[200px] mt-[30px] object-cover rounded-md cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              />

              <div>
                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                <p className="text-gray-700">Price: ${product.price}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>

              <button
                className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                onClick={() => {
                  if (!userId) {
                    Swal.fire({
                      icon: "error",
                      title: "Authentication Required",
                      text: "Please log in to buy this product.",
                      showConfirmButton: true,
                      confirmButtonText: "Login",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate("/login");
                      }
                    });
                  } else {
                    navigate(`/addresspage/${product._id}`);
                  }
                }}
              >
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-black text-center w-full">No products found.</p>
        )}
      </div>
    </div>
  );
}

