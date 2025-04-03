

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Settings } from "lucide-react";
import Swal from "sweetalert2";
import { logout } from "../redux/authSlice";
import { fetchWishlist } from "../redux/wishlistSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, name } = useSelector((state) => state.auth);
  const wishlistCount = useSelector((state) => state.wishlist.products.length);
  console.log(token,name,);

  

// useEffect(() => {
//   console.log("Wishlist updated:", wishlistCount);
// }, [wishlistCount]);
useEffect(() => {
  dispatch(fetchWishlist());  // Fetch wishlist when header loads
}, [dispatch]);

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setTimeout(() => setIsOpen(false), 100);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        setIsOpen(false);
        navigate("/");
        Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
      }
    });
  };

  return (
    <div className="navbar flex justify-between items-center bg-white shadow-md px-10 py-4">
      <div className="flex items-center gap-10">
        <div className="text-4xl font-black text-gray-900">TrendNest</div>

        {/* Navigation Links with Active Highlight */}
        <nav className="hidden md:flex gap-8 text-lg font-semibold">
          <Link
            to="/"
            className={`transition ${isActive("/") ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-gray-500"}`}
          >
            Home
          </Link>
          <Link
            to="/products/women"
            className={`transition ${isActive("/products/women") ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-gray-500"}`}
          >
            Womens
          </Link>
          <Link
            to="/products/men"
            className={`transition ${isActive("/products/men") ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-gray-500"}`}
          >
            Mens
          </Link>
          <Link
            to="/aboutpage"
            className={`transition ${isActive("/aboutpage") ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-gray-500"}`}
          >
            About
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
    
        <Link to="/wishpage" className="relative group">
  <div
    className={`p-2 rounded-full transition ${
      isActive("/wishpage") ? "bg-red-100 text-red-500 scale-110" : "text-gray-600 hover:text-red-500"
    }`}
  >
    <Heart className="w-6 h-6" />
    {wishlistCount > 0 && (
      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {wishlistCount}
      </span>
    )}
  </div>
</Link>

        <Link to="/cartpage" className="relative group">
          <div
            className={`p-2 rounded-full transition ${
              isActive("/cartpage") ? "bg-blue-100 text-blue-500 scale-110" : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
          </div>
        </Link>

        <div className="relative dropdown-container">
          <button
            className="group focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            <div
              className={`p-2 rounded-full transition ${
                isActive("/settings") ? "bg-green-100 text-green-500 scale-110" : "text-gray-600 hover:text-green-500"
              }`}
            >
              <Settings className="w-6 h-6" />
            </div>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
              <ul className="py-2">
                {token ? (
                  <>
                    {/* Display the logged-in user's name */}
                    <li className="px-4 py-2 text-gray-800 font-semibold">
                      Hi, {name} 
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;



