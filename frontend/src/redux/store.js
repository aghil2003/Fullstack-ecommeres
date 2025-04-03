import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productsReducer from "./productsSlice";
import wishlistReducer from "./wishlistSlice";
import addressReducer from "./reducers/addressReducer";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    cart: cartReducer,
  },
});

export default store;
