// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../axios/axiosInstance";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { persistor } from "../redux/store";

// const token = Cookies.get("token") || null;
// let decodedToken = "";


// if (token) {
//   try {
//     decodedToken = jwtDecode(token);
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     Cookies.remove("token"); 
//   }
// }

// // Async Thunks
// export const logoutUser = () => async (dispatch) => {
//   Cookies.remove("token");         // clear token cookie
//   dispatch(logout());              // clear redux auth state
//   await persistor.purge();         // purge persisted state
//   window.location.reload();        // refresh the app
// };

// export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post("/login", { email, password });
//     const token = response.data.token;
    
//     Cookies.set("token", token, { expires: 7 });

//     const decodedToken = jwtDecode(token);
//     return { token, role: decodedToken.role, name: decodedToken.name, userId: decodedToken.userId, email: decodedToken.email };
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || "Invalid credentials");

//   }
// });

// export const registerUser = createAsyncThunk("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post("/register", { name, email, password });
//     const token = response.data.token;
//     Cookies.set("token", token, { expires: 7 });

//     const decodedToken = jwtDecode(token);
//     return { token, role: decodedToken.role, name: decodedToken.name, userId: decodedToken.userId, email: decodedToken.email };
//   } catch (error) {
//     return rejectWithValue(
//       error.response?.data?.message || "Invalid credentials"
//     );
    
//   }
// });

// // Auth Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     token,
//     userId: decodedToken?.userId || null, 
//     role: decodedToken?.role || null,
//     name: decodedToken?.name || null,
//     email: decodedToken?.email || null,
//     loading: false,
//     error: null,
//     successMessage: null,
//   },
//   reducers: {
//     logout: (state) => {
//       console.log("Clearing token from cookies"); 
//       Cookies.remove("token");
//       state.token = null;
//       state.role = null;
//       state.name = null;
//       state.email = null;
//       state.userId = null;
//       // window.location.reload();
//       // dispatch(logout());
//       // persistor.purge(); 
//     },
//     clearMessage: (state) => {
//       state.successMessage = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.role = action.payload.role;
//         state.name = action.payload.name;
//         state.email = action.payload.email;
//         state.userId = action.payload.userId;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })      
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.role = action.payload.role;
//         state.name = action.payload.name;
//         state.email = action.payload.email;
//         state.userId = action.payload.userId;
//         state.successMessage = "Registration successful!"; 
//       })      
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout, clearMessage } = authSlice.actions;
// export default authSlice.reducer;


  
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { persistor } from "../redux/store";

const token = Cookies.get("token") || null;
let decodedToken = "";

if (token) {
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    Cookies.remove("token");
  }
}

// Async Thunks
export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/login", { email, password });
    const token = response.data.token;

    Cookies.set("token", token, { expires: 7 });

    const decodedToken = jwtDecode(token);
    return { token, role: decodedToken.role, name: decodedToken.name, userId: decodedToken.userId, email: decodedToken.email };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Invalid credentials");
  }
});

export const registerUser = createAsyncThunk("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/register", { name, email, password });
    const token = response.data.token;

    Cookies.set("token", token, { expires: 7 });

    const decodedToken = jwtDecode(token);
    return { token, role: decodedToken.role, name: decodedToken.name, userId: decodedToken.userId, email: decodedToken.email };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Invalid credentials");
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token,
    userId: decodedToken?.userId || null,
    role: decodedToken?.role || null,
    name: decodedToken?.name || null,
    email: decodedToken?.email || null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      state.email = null;
      state.userId = null;
    },
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.userId = action.payload.userId;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.userId = action.payload.userId;
        state.successMessage = "Registration successful!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;

// 🔄 Logout thunk to clear state and storage
export const logoutUser = () => async (dispatch) => {
  Cookies.remove("token");
  dispatch(logout());
  await persistor.purge();
  window.location.reload();
};
