import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../axios/axiosInstance";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

// Fetch Cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("No token found");

  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId || decodedToken.id;
    const response = await AxiosInstance.get(`/cart/${userId}`);

    return response.data.products || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Add Item
export const addItem = createAsyncThunk("cart/addItem", async ({ productId, size }, { rejectWithValue }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("No token found");

  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId || decodedToken.id;
    await AxiosInstance.post(`/cart/${userId}/add`, { productId, size });

    return { productId, size };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Decrease Item
export const decreaseItem = createAsyncThunk("cart/decreaseItem", async ({ productId, size }, { rejectWithValue }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("No token found");

  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId || decodedToken.id;
    await AxiosInstance.put(`/cart/${userId}/decrease`, { productId, size });

    return { productId, size };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete Item
export const deleteItem = createAsyncThunk("cart/deleteItem", async ({ productId, size }, { rejectWithValue }) => {
  const token = Cookies.get("token");
  if (!token) return rejectWithValue("No token found");

  try {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId || decodedToken.id;
    await AxiosInstance.delete(`/cart/${userId}/${productId}`);

    return { productId, size };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        const groupedProducts = action.payload.reduce((acc, product) => {
          const key = `${product._id}-${product.size}`;
          if (acc[key]) {
            acc[key].quantity += product.quantity;
          } else {
            acc[key] = { ...product, quantity: product.quantity, size: product.size };
          }
          return acc;
        }, {});
        state.products = Object.values(groupedProducts);
        state.status = "succeeded";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        const { productId, size } = action.payload;
        const product = state.products.find((p) => p._id === productId && p.size === size);
        if (product) product.quantity += 1;
      })
      .addCase(decreaseItem.fulfilled, (state, action) => {
        const { productId, size } = action.payload;
        const product = state.products.find((p) => p._id === productId && p.size === size);
        if (product) {
          product.quantity -= 1;
          if (product.quantity <= 0) {
            state.products = state.products.filter((p) => !(p._id === productId && p.size === size));
            Swal.fire({ icon: "info", title: "Item Removed", text: "Item has been removed from your cart.", timer: 1500, showConfirmButton: false });
          }
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        const { productId, size } = action.payload;
        state.products = state.products.filter((p) => !(p._id === productId && p.size === size));
        Swal.fire({ icon: "success", title: "Deleted!", text: "Item has been removed from your cart.", timer: 1500, showConfirmButton: false });
      })
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => { state.status = "loading"; }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => { state.status = "failed"; state.error = action.payload; }
      );
  },
});

export default cartSlice.reducer;
