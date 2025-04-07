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
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const token = Cookies.get("token");
  let userId = null;
  
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId || decodedToken.id;
    console.log(userId, "userId");
  }
    

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axiosInstance.get(`/products?userId=${userId}&category=${category}`);
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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      products.map((product) => (
        <div
          key={product._id}
          className="bg-white w-full sm:w-full p-4 shadow-lg rounded-lg flex flex-col justify-between relative"
        >
          <img
            src={product.productImage}
            alt={product.name}
            className="w-full h-[220px] object-cover rounded-lg shadow-md"
            onClick={() => navigate(`/product/${product._id}`)}
          />
          <div className="flex items-center justify-between mt-4">
            <h1 className="text-xl font-semibold text-gray-800">{product.name}</h1>
            <p className="text-lg font-medium text-blue-600">${product.price}</p>
          </div>
          <p className="text-gray-600 mt-2 text-sm">{product.description}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => toggleLike(product._id)}
              className={`p-2 rounded-full ${likedProducts[product._id] ? "text-red-500" : "text-gray-400"}`}
            >
              <Heart fill={likedProducts[product._id] ? "red" : "none"} />
            </button>
            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="text-blue-500 hover:underline"
            >
              View Details
            </button>
          </div>
        </div>
      ))
    )}
  </div>
      );
    }
//     <div className="w-[100%]">
      // <h2 className="text-2xl font-bold">
      //   {category === "men" ? "Men's Products" : "Women's Products"}
      // </h2>

      // {/* {loading && <p>Loading...</p>}
      // {error && <p className="text-red-500">{error}</p>} */}

//       <div className="flex flex-wrap gap-4 w-[90%] m-auto">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <div
//               key={product._id}
//               className="bg-white w-[30%] p-4 shadow-lg rounded-lg flex flex-col justify-between relative"
//             >
//               <button
//                 className="absolute top-2 right-2 p-1 rounded-full shadow-md hover:text-red-500 transition"
//                 onClick={() => toggleLike(product._id)}
//               >
//                 <Heart
//                   size={24}
//                   fill={likedProducts[product._id] ? "red" : "none"}
//                   stroke={likedProducts[product._id] ? "red" : "gray"}
//                 />
//               </button>

//               <img
//                src={product.productImage}
//                alt={product.name}
//                className="w-full h-auto mt-[30px] object-cover rounded-md cursor-pointer"
//                onClick={() => navigate(`/product/${product._id}`)}
//               />


//               <div>
//                 <h2 className="text-lg font-bold mt-2">{product.name}</h2>
//                 <p className="text-gray-700">Price: ${product.price}</p>
//                 <p className="text-sm text-gray-500">{product.description}</p>
//               </div>

//               <button
//                 className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
//                 onClick={() => {
//                   if (!userId) {
//                     Swal.fire({
//                       icon: "error",
//                       title: "Authentication Required",
//                       text: "Please log in to buy this product.",
//                       showConfirmButton: true,
//                       confirmButtonText: "Login",
//                     }).then((result) => {
//                       if (result.isConfirmed) {
//                         navigate("/login");
//                       }
//                     });
//                   } else {
//                     navigate(`/addresspage/${product._id}`);
//                   }
//                 }}
//               >
//                 Buy Now
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="text-black text-center w-full">No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

{/* <div className="w-full">
  <h2 className="text-2xl font-bold">
    {category === "men" ? "Men's Products" : "Women's Products"}
  </h2>

  <div className="flex flex-wrap gap-4 w-[90%] m-auto">
    {products.length > 0 ? (
      products.map((product) => (
        <div
          key={product._id}
          className="bg-white w-full sm:w-1/3 md:w-1/4 lg:w-1/4 p-4 shadow-lg rounded-lg flex flex-col justify-between relative"
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
            className="w-full h-auto mt-[30px] object-cover rounded-md cursor-pointer"
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
} */}
