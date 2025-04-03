import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://fullstack-ecommeres.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_ECOMMERCE_AXIOS_URL, 
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// export default axiosInstance;
