import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice"; 
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Img1 from "../assets/boy.jpg";
import Img2 from "../assets/girl.jpg";
import { Heart, ShoppingCart, Settings } from "lucide-react";
import Swal from "sweetalert2";
import { fetchWishlist } from "../redux/wishlistSlice";

export default function HeroContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token,name } = useSelector((state) => state.auth); 
  const wishlistCount = useSelector((state) => state.wishlist.products.length);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const images = [Img1, Img2];
  const texts = ["New Trend for Mens", "New Trend for Girls"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
 
  useEffect(() => {
      
      const usertoken = Cookies.get("token");
      if ( usertoken) {
        try {
          const decodedToken = jwtDecode(usertoken);
          const userId=decodedToken.userId || decodedToken.id || null;
          console.log(userId,"userId test");
          setUserId(userId)
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }}
    )
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setTimeout(() => setIsOpen(false), 100);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        setIsOpen(false);
        navigate("/");
  
        Swal.fire({
          title: "Logged Out!",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    dispatch(fetchWishlist());  // Fetch wishlist when header loads
  }, [dispatch]);
  return (
//     <div className="bg-[#ffff] h-[500px]">
//       {/* Navbar Section */}
//       <div
//         className={`fixed top-0 left-0 w-full p-2 transition-all duration-300 ${
//           isScrolled ? "bg-white text-black shadow-md" : "bg-transparent"
//         } z-50`}
//       >
//         <div className="navbar flex justify-between items-center px-10 py-4">
//           {/* Left Section: Logo + Nav Links */}
//           <div className="flex items-center gap-10">
//             <div className="text-4xl fon t-black text-gray-900">TrendNest</div>
//             <nav className="hidden md:flex gap-8 text-lg font-semibold text-gray-700">
//               <Link
//                 to="/"
//                 className={`transition ${
//                   location.pathname === "/"
//                     ? "text-blue-600 border-b-2 border-blue-600"
//                     : "text-gray-700 hover:text-gray-500"
//                 }`}
//               >
//                 Home
//               </Link>
//               <Link to="/products/women" className="hover:text-gray-500 transition">
//                 Womens
//               </Link>
//               <Link to="/products/men" className="hover:text-gray-500 transition">
//                 Mens
//               </Link>
//               <Link to="/aboutpage" className="hover:text-gray-500 transition">
//                 About
//               </Link>
//             </nav>
//           </div>

//           {/* Right Section: Icons */}
//           <div className="flex items-center gap-6">
//           <Link className="relative group">
//   <div
//     className={`p-2 rounded-full transition ${
//       isActive("/wishpage") ? "bg-red-100 text-red-500 scale-110" : "text-gray-600 hover:text-red-500"
//     }`}
//     onClick={() => {
//       if (!userId) {
//         Swal.fire({
//           icon: "error",
//           title: "Authentication Required",
//           text: "Please log in to see the wishlistPage.",
//           showConfirmButton: true,
//           confirmButtonText: "Login",
//         }).then((result) => {
//           if (result.isConfirmed) {
//             navigate("/login"); 
//           }
//         });
//       } else {
//         // Proceed to the wishlist page if the user is logged in
//         navigate("/wishpage");
//       }
//     }}
//   >
//     <Heart className="w-6 h-6" />
//     {wishlistCount > 0 && (
//       <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//         {wishlistCount}
//       </span>
//     )}
//   </div>
// </Link>


// <Link to="/cartpage" className="hover:text-gray-500 transition">
//   <div
//     onClick={() => {
//       if (!userId) {
//         Swal.fire({
//           icon: "error",
//           title: "Authentication Required",
//           text: "Please log in to see your cart.",
//           showConfirmButton: true,
//           confirmButtonText: "Login",
//         }).then((result) => {
//           if (result.isConfirmed) {
//             navigate("/login");
//           }
//         });
//       }
//     }}
//   >
//     <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition" />
//   </div>
// </Link>


// <div className="relative dropdown-container">
//           <button
//             className="group focus:outline-none"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsOpen((prev) => !prev);
//             }}
//           >
//             <div
//               className={`p-2 rounded-full transition ${
//                 isActive("/settings") ? "bg-green-100 text-green-500 scale-110" : "text-gray-600 hover:text-green-500"
//               }`}
//             >
//               <Settings className="w-6 h-6" />
//             </div>
//           </button>

//           {isOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
//               <ul className="py-2">
//                 {token ? (
//                   <>
//                     {/* Display the logged-in user's name */}
//                     <li className="px-4 py-2 text-gray-800 font-semibold">
//                       Hi, {name} 
//                     </li>
//                     <li>
//                       <Link
//                         to="/orders"
//                         className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
//                       >
//                         Orders
//                       </Link>
//                     </li>
//                     <li>
//                       <button
//                         className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
//                         onClick={handleLogout}
//                       >
//                         Logout
//                       </button>
//                     </li>
//                   </>
//                 ) : (
//                   <>
//                   <li>
//                     <Link
//                       to="/login"
//                       className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
//                     >
//                       Login
//                     </Link>
//                   </li>
//                    <li>
//                    <Link
//                      to="/register"
//                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
//                    >
//                      Register
//                    </Link>
//                  </li>
//                  </>
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 1 }}
//         className="pt-[100px] flex flex-col items-center"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1, delay: 0.5 }}
//           className="relative w-[100%] h-[400px] bg-white overflow-hidden flex items-center justify-center"
//         >
//           {/* Image Slider */}
//           <AnimatePresence mode="wait">
//             <motion.img
//               key={currentIndex}
//               src={images[currentIndex]}
//               alt="Sliding Image"
//               initial={{ x: "100%", opacity: 0 }}
//               animate={{ x: "0%", opacity: 1 }}
//               exit={{ x: "-100%", opacity: 0 }}
//               transition={{ duration: 1.5 }}
//               className="absolute inset-0 object-cover w-[700px] h-[500px]"
//             />
//           </AnimatePresence>

//           {/* Text Animation */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentIndex}
//               initial={{ opacity: 0, x: 100 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -100 }}
//               transition={{ duration: 2, ease: "easeInOut" }}
//               className="absolute bottom-10 right-10 left-170 text-black text-3xl md:text-6xl lg:text-7xl font-extrabold p-6 rounded-xl"
//             >
//               {texts[currentIndex]}
//             </motion.div>
//           </AnimatePresence>
//         </motion.div>
//       </motion.div>
//     </div>

<div className="bg-[#ffff] min-h-[500px]">
  {/* Navbar Section */}
  <div
    className={`fixed top-0 left-0 w-full p-2 transition-all duration-300 ${
      isScrolled ? "bg-white text-black shadow-md" : "bg-transparent"
    } z-50`}
  >
    <div className="navbar flex justify-between items-center px-4 sm:px-6 md:px-10 py-4">
      {/* Logo & Nav Links */}
      <div className="flex items-center gap-6 sm:gap-10">
        <div className="text-3xl sm:text-4xl font-black text-gray-900">TrendNest</div>
        <nav className="hidden md:flex gap-6 text-base sm:text-lg font-semibold text-gray-700">
          <Link to="/" className={`transition ${location.pathname === "/" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-gray-500"}`}>Home</Link>
          <Link to="/products/women" className="hover:text-gray-500 transition">Womens</Link>
          <Link to="/products/men" className="hover:text-gray-500 transition">Mens</Link>
          <Link to="/aboutpage" className="hover:text-gray-500 transition">About</Link>
        </nav>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Wishlist */}
        <div className="relative group cursor-pointer">
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
                  confirmButtonText: "Login",
                }).then((res) => {
                  if (res.isConfirmed) navigate("/login");
                });
              } else {
                navigate("/wishpage");
              }
            }}
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="cursor-pointer">
          <div
            onClick={() => {
              if (!userId) {
                Swal.fire({
                  icon: "error",
                  title: "Authentication Required",
                  text: "Please log in to see your cart.",
                  confirmButtonText: "Login",
                }).then((res) => {
                  if (res.isConfirmed) navigate("/login");
                });
              } else {
                navigate("/cartpage");
              }
            }}
          >
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-blue-500 transition" />
          </div>
        </div>

        {/* Settings Dropdown */}
        <div className="relative dropdown-container">
          <button className="group focus:outline-none" onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}>
            <div className={`p-2 rounded-full transition ${isActive("/settings") ? "bg-green-100 text-green-500 scale-110" : "text-gray-600 hover:text-green-500"}`}>
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
                      <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Orders</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
                    </li>
                    <li>
                      <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Hero Section */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1 }}
    className="pt-[100px] flex flex-col items-center"
  >
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative w-full max-w-[1200px] h-[250px] sm:h-[300px] md:h-[400px] bg-white overflow-hidden flex items-center justify-center"
    >
      {/* Image Slider */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Sliding Image"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 object-cover w-full h-full"
        />
      </AnimatePresence>

      {/* Text Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute bottom-6 right-6 left-6 sm:left-10 sm:right-10 text-black text-2xl sm:text-4xl md:text-6xl font-extrabold bg-white/80 p-4 rounded-xl"
        >
          {texts[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  </motion.div>
</div>
  );

}
