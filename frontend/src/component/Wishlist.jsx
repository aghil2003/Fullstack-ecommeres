import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWishlist, toggleWishlist } from "../redux/wishlistSlice";
import { Heart } from "lucide-react";
import Swal from "sweetalert2";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, likedProducts, status } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="w-full h-auto bg-white">
      <div className="text-[50px] font-bold pl-[50px] mt-[10px]">Wishlist</div>
      <div className="w-[80%] h-auto m-auto flex flex-wrap justify-between items-center p-4 gap-4">
        {status === "loading" ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="bg-white w-[30%] h-[400px] p-4 shadow-lg rounded-lg flex flex-col justify-between relative">
              <button
                className="absolute top-2 right-2 p-1 rounded-full shadow-md text-gray-400 hover:text-red-500 transition"
                onClick={() => dispatch(toggleWishlist(product._id))}
              >
                <Heart size={24} fill={likedProducts[product._id] ? "red" : "none"} stroke={likedProducts[product._id] ? "red" : "gray"} />
              </button>

              <img
                src={product.productImage}
                alt={product.name}
                className="w-full h-[200px] mt-[30px] object-cover rounded-md cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              />

              <div>
                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                <p className="text-gray-700">${product.price}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>

              <button className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Buy Now</button>
            </div>
          ))
        ) : (
          <ul className="text-center w-full list-none bg-gray-100 p-6 rounded-lg shadow-md">
          <li className="text-lg font-semibold text-gray-700">Oops! Your wishlist is empty. 😢</li>
          <li className="text-gray-600 mt-2">Start exploring and add your favorite products.</li>
          <li className="text-gray-600 mt-2">Click the <span className="text-red-500 font-bold">❤️</span> icon on any product to save it here!</li>
          <li className="mt-4">
            <button
              className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition shadow-lg"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </li>
        </ul>
        
        )}
      </div>
    </div>
  );
}
