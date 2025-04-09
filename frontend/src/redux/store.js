// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
// import productsReducer from "./productsSlice";
// import wishlistReducer from "./wishlistSlice";
// import addressReducer from "./reducers/addressReducer";
// import cartReducer from "./cartSlice";

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     products: productsReducer,
//     wishlist: wishlistReducer,
//     address: addressReducer,
//     cart: cartReducer,
//   },
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";

import authReducer from "./authSlice";
import productsReducer from "./productsSlice";
import wishlistReducer from "./wishlistSlice";
import addressReducer from "./reducers/addressReducer";
import cartReducer from "./cartSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["products", "wishlist", "cart"] // Add reducers you want to persist
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  wishlist: wishlistReducer,
  address: addressReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
