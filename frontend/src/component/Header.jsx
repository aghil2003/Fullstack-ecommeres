import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Settings } from "lucide-react";
import { Menu as MenuIcon } from "lucide-react";

import Swal from "sweetalert2";
import { logoutUser } from "../redux/authSlice";
import { fetchWishlist } from "../redux/wishlistSlice";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, name } = useSelector((state) => state.auth);
  const wishlistCount = useSelector((state) => state.wishlist.products.length);

  useEffect(() => {
    const usertoken = Cookies.get("token");
    if (usertoken) {
      try {
        const decodedToken = jwtDecode(usertoken);
        const userId = decodedToken.userId || decodedToken.id || null;
        console.log(userId, "userId test");
        setUserId(userId); // Correct state update
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []); 

  useEffect(() => {
    dispatch(fetchWishlist());
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
        dispatch(logoutUser());
        setIsOpen(false);
        navigate("/");
        Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
      }
    });
  };

  return (
    <div className="navbar flex justify-between items-center bg-white shadow-md px-4 py-4 md:px-10 md:py-4">
      <div className="flex items-center gap-4 md:gap-10">
        <div className="text-3xl font-black text-gray-900">TrendNest</div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links with Active Highlight */}
        <nav className={`md:flex gap-8 text-lg font-semibold ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
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

      <div className="flex items-center gap-4 md:gap-6">
        {/* Wishlist Icon */}
        <Link className="relative group">
          <div
            className={`p-2 rounded-full transition ${
              isActive("/wishpage") ? "bg-red-100 text-red-500 scale-110" : "text-gray-600 hover:text-red-500"
            }`}
            onClick={() => {
              if (!userId) {
                Swal.fire({
                  icon: "error",
                  title: "Authentication Required",
                  text: "Please log in to see the wishlistPage.",
                  showConfirmButton: true,
                  confirmButtonText: "Login",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/login");
                  }
                });
              } else {
                navigate("/wishpage");
              }
            }}
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
        </Link>

        {/* Cart Icon */}
        <Link to="/cartpage" className="hover:text-gray-500 transition">
          <div
           className={`p-2 rounded-full transition ${
            isActive("/cartpage") ? "bg-blue-100 text-blue-500 scale-110" : "text-gray-600 hover:text-blue-500"
          }`}
            onClick={() => {
              if (!userId) {
                Swal.fire({
                  icon: "error",
                  title: "Authentication Required",
                  text: "Please log in to see your cart.",
                  showConfirmButton: true,
                  confirmButtonText: "Login",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/login");
                  }
                });
              }
            }}
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition" />
          </div>
        </Link>

        {/* Settings Dropdown */}
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
                    <li className="px-4 py-2 text-gray-800 font-semibold">Hi, {name}</li>
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
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Register
                      </Link>
                    </li>
                  </>
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




