

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import Swal from "sweetalert2";
import { logout } from "../redux/authSlice" 

function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setTimeout(() => setIsOpen(false), 100);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === "/dashbord" && location.pathname === "/dashbord") return true; 
    return location.pathname === path;

  };
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

        <nav className="hidden md:flex gap-8 text-lg font-semibold">
          <Link
            to="/dashbord"
            className={`transition ${
              isActive("/dashbord") ? "text-green-600 underline" : "text-gray-700 hover:text-gray-500"
            }`}
          >
            Home
          </Link>
          <Link
            to="/adminproducts/women"
            className={`transition ${
              isActive("/adminproducts/women") ? "text-green-600 underline" : "text-gray-700 hover:text-gray-500"
            }`}
          >
            Womens
          </Link>
          <Link
            to="/adminproducts/men"
            className={`transition ${
              isActive("/adminproducts/men") ? "text-green-600 underline" : "text-gray-700 hover:text-gray-500"
            }`}
          >
            Mens
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative dropdown-container">
          <button
            className="group focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            <Settings className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg">
              <ul className="py-2">
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                    onClick={() => {
                      handleLogout();
                      console.log("User logged out");
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
