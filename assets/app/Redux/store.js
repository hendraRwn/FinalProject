import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { detProduct } from "./detProduct";

export const store = configureStore({
	reducer: {
		[authSlice.name]: authSlice.reducer,
		[detProduct.name]: detProduct.reducer,
	},
});
