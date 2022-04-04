import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token: "",
	userName: "",
	userEmail: "",
	userId: "",
	isSignIn: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logIn: (state, action) => {
			state.token = action.payload.token;
			state.userName = action.payload.userName;
			state.userEmail = action.payload.userEmail;
			state.userId = action.payload.userId;
		},

		logOut: (state) => {
			state.token = "";
			state.userName = "";
		},

		setSignInStatus: (state, action) => {
			state.isSignIn = action.payload;
		},
	},
});

export const { logOut, logIn, setSignInStatus } = authSlice.actions;

export default authSlice.reducer;
