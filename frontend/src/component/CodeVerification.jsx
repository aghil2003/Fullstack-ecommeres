
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  
import axiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function Otp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,seterror] = useState("")
  const [resendDisabled, setResendDisabled] = useState(true); 
  const [timer, setTimer] = useState(60); 
  const navigate = useNavigate();

  const token = Cookies.get("token");

  let userId = null;
  let email = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
      email = decoded.email;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // Automatically enable the "Resend OTP" button after 1 min
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 4) {
      setOtp(value);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token || !email) {
      console.log("Session expired. Please log in again.");
      
      seterror("Session expired. Please log in again.");
      return;
    }
  
    if (!otp || otp.length !== 4) {
      seterror("Please enter a valid 4-digit OTP.");
      return;
    }
  
    setLoading(true);
    console.log("Sending OTP Verification:", { email, otp });
  
    try {
      const response = await axiosInstance.post("/verification", { email, otp });
  
      if (response.data.success) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken, "Decoded Token...");
  
        if (decodedToken.role === "Admin") {
          Swal.fire({
            title: "Verification Successful!",
            text: "Go to Dashboard",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            navigate("/dashbord");
          });
        } else {
          Swal.fire({
            title: "Verification Successful!",
            text: "Go to Home Page",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            navigate("/");
          });
        }
      } else {
        seterror(response.data.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      seterror(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmitForResend = async (e) => {
    e.preventDefault();

    if (!token || !email) {
      return;
    }
    setResendDisabled(true); 
    setTimer(60); 

    try {
      console.log(token,"token test");
      
      const response = await axiosInstance.post("/resendOtp");
      console.log( response,",..,,.");
      
      if (response.data.success) {
        seterror("OTP resent successfully. Check your email.");
      } else {
        seterror(response.data.message || "Failed to resend OTP. Try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error.response?.data || error.message);
      seterror("Resend failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          OTP Verification
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Enter the OTP sent to your email
        </p>

        <form id="otpForm" className="mt-4" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <input
              type="text"
              maxLength="4"
              value={otp}
              onChange={handleChange}
              className="w-32 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="w-[100%] text-center text-[red] text-[15px]">
            {error}
          </div>
          <button
            type="submit"
            className={`w-full mt-5 py-2 rounded-lg text-lg font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleSubmitForResend}
          className={`w-full mt-5 py-2 rounded-lg text-lg font-medium transition ${
            resendDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={resendDisabled}
        >
          {resendDisabled ? `Wait ${timer}s...` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default Otp;

