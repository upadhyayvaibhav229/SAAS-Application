import { createSlice } from "@reduxjs/toolkit";
import { products } from "../assets/frontend_assets/products";

const initialState = {
    products: products,
    currency: "₹",
    deliveryFee: 10,
    cart: [],
    totalprice: 0,
    totalQuantity: 0,
}

const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {}
})

export const selectShop = (state) => state.shop;

export default shopSlice.reducer;