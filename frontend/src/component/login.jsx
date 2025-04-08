// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../redux/authSlice";

// export default function LoginPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { token, role, loading, error } = useSelector((state) => state.auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     if (token) {
//       role === "Admin" ? navigate("/dashbord") : navigate("/");
//     }
//   }, [token, role, navigate]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ email, password }));
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
//         <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
//         {error && <p className="text-center text-sm text-red-500">{error}</p>}

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-gray-600 text-sm mb-1">Email</label>
//             <input
//               type="text"
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600 text-sm mb-1">Password</label>
//             <input
//               type="password"
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         <p className="text-center text-sm text-gray-500 mt-4">
//              Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      role === "Admin" ? navigate("/dashbord") : navigate("/");
    }
  }, [token, role, navigate]);

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFormError(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

        {/* Backend error */}
        {error && <p className="text-center text-sm text-red-500 mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                formError.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
              }`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formError.email && (
              <p className="text-sm text-red-500 mt-1">{formError.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                formError.password ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"
              }`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formError.password && (
              <p className="text-sm text-red-500 mt-1">{formError.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
