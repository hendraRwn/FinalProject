import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	produkid: "",
	kategoriid: "",
	kategorinama: "",
	namaproduk: "",
	harga: "",
    berat: "",
    urlimage: "",
    detailproduk: "",
};

export const detProduct = createSlice({
	name: "produk",
	initialState,
	reducers: {
		setDataProduk: (state, action) => {
			state.produkid = action.payload.produkid;
			state.kategoriid = action.payload.kategoriid;
			state.kategorinama = action.payload.kategorinama;
			state.namaproduk = action.payload.namaproduk;
            state.harga = action.payload.harga;
            state.berat = action.payload.berat;
            state.urlimage = action.payload.urlimage;
            state.detailproduk = action.payload.detailproduk;
		},

		clearData: (state) => {
            state.produkid = "";
			state.kategoriid = "";
			state.kategorinama = "";
			state.namaproduk = "";
            state.harga = "";
            state.berat = "";
            state.urlimage = "";
            state.detailproduk = "";
		},
	},
});

export const { setDataProduk, clearData } = detProduct.actions;

export default detProduct.reducer;
