import { configureStore } from "@reduxjs/toolkit";
import ShopReducer from '../Features/ShopSlice'
// import cartReducer from  '../Features/cartSlice'
// import SearchFilterReducer from '../Features/SearchFilter'
// import authReducer from '../Features/authSlice'

export const store = configureStore({
  reducer: {
    shop: ShopReducer,
    // cart: cartReducer,
    // searchFilter: SearchFilterReducer,
    // auth: authReducer
  },
});
