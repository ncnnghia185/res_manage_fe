import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authStateTypes{
	isLoggedIn: boolean,
	user: null
}

const initialState: authStateTypes = {
	isLoggedIn: false,
	user:null
}

export const userSlice = createSlice({
	name:"user",
	initialState: initialState,
	reducers:{
		login:(state, action) =>{
			state.isLoggedIn = true
			state.user = action.payload
		},
		logout:(state)=>{
			state.isLoggedIn = false
			state.user = null
		},
		setUser: (state,action) =>{
			state.user = action.payload
		}
	}
})

export const { login, logout, setUser } = userSlice.actions;

export const userReducer =  userSlice.reducer