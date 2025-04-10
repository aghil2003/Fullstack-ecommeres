
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import AxiosInstance from "../axios/axiosInstance";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { logout } from "../redux/authSlice"; 


// export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
//   const token = Cookies.get("token");
//   if (!token) return rejectWithValue("No token found. User not authenticated.");
//   try {
//     const decodedToken = jwtDecode(token);
//     const userId = decodedToken?.id || decodedToken?._id;
//     const response = await AxiosInstance.get(`/wishgproduct/${userId}`);
//     return response.data.products || [];
//   } catch (error) {
//     return rejectWithValue(error.response?.data || "Error fetching wishlist");
//   }
// });

// export const toggleWishlist = createAsyncThunk("wishlist/toggleWishlist", async (productId, { rejectWithValue, getState }) => {
//   const token = Cookies.get("token");
//   if (!token) return rejectWithValue("No token found. User not authenticated.");
//   try {
//     const decodedToken = jwtDecode(token);
//     const userId = decodedToken?.id || decodedToken?._id;
//     const { wishlist } = getState();
//     const isLiked = wishlist.likedProducts[productId];

//     if (isLiked) {
//       await AxiosInstance.delete(`/favorites/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { userId },
//       });
//       return productId;
//     } else {
//       const response = await AxiosInstance.post(
//         "/favorites",
//         { userId, productId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data.product;
//     }
//   } catch (error) {
//     return rejectWithValue(error.response?.data || "Error updating wishlist");
//   }
// });

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState: { products: [], likedProducts: {}, status: "idle", error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWishlist.pending, (state) => { state.status = "loading"; })
//       .addCase(fetchWishlist.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.products = action.payload;
//         state.likedProducts = action.payload.reduce((acc, product) => {
//           acc[product._id] = true;
//           return acc;
//         }, {});
//       })
//       .addCase(fetchWishlist.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(toggleWishlist.fulfilled, (state, action) => {
//         if (typeof action.payload === "string") {
//           state.products = state.products.filter((product) => product._id !== action.payload);
//           delete state.likedProducts[action.payload];
//         } else {
//           state.products.push(action.payload);
//           state.likedProducts[action.payload._id] = true;
//         }
//       })
//       .addCase(logout.type, (state) => {
//         state.products = [];
//         state.likedProducts = {};
//         state.status = "idle";
//         state.error = null;
//       });
//   },
// });

// export default wishlistSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("No token found. User not authenticated.");
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.id || decodedToken?._id;
    const response = await AxiosInstance.get(`/wishgproduct/${userId}`);
    return response.data.products || [];
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching wishlist");
  }
});

export const toggleWishlist = createAsyncThunk("wishlist/toggleWishlist", async (productId, { rejectWithValue, getState }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("No token found. User not authenticated.");
  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.id || decodedToken?._id;
    const { wishlist } = getState();
    const isLiked = wishlist.likedProducts[productId];

    if (isLiked) {
      await AxiosInstance.delete(`/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId },
      });
      return productId;
    } else {
      const response = await AxiosInstance.post(
        "/favorites",
        { userId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.product;
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating wishlist");
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { products: [], likedProducts: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.status = "loading"; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.likedProducts = action.payload.reduce((acc, product) => {
          acc[product._id] = true;
          return acc;
        }, {});
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (typeof action.payload === "string") {
          state.products = state.products.filter((product) => product._id !== action.payload);
          delete state.likedProducts[action.payload];
        } else {
          state.products.push(action.payload);
          state.likedProducts[action.payload._id] = true;
        }
      });
  },
});

export default wishlistSlice.reducer;
