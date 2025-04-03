import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Get user ID from token
const token = Cookies.get("token");
let userId = null;
if (token) {
  try {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId || decodedToken.id;
  } catch (error) {
    console.error("Error decoding token:", error);
  }
}

// Fetch products based on category
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products`, {
        params:{category},
        headers: userId ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to load products.");
    }
  }
);

// Toggle like functionality
export const toggleLike = createAsyncThunk(
  "products/toggleLike",
  async ({ productId, isLiked }, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("Authentication Required");
    }
    try {
      // Toggle like (remove from favorites if already liked, add if not liked)
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
      return { productId, isLiked: !isLiked }; // Return updated productId and isLiked status
    } catch (error) {
      return rejectWithValue("Error updating favorite.");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    likedProducts: {}, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        // Initialize likedProducts based on the products' isLiked status
        state.likedProducts = action.payload.reduce((acc, product) => {
          acc[product._id] = product.isLiked;
          return acc;
        }, {});
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        // Update the likedProducts state with the new like status
        state.likedProducts[action.payload.productId] = action.payload.isLiked;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
