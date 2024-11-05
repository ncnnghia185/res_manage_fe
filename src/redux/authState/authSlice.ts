import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authStateTypes{
	isLoggedIn: boolean,
	userId: number | null
	user: null
}

const initialState: authStateTypes = {
	isLoggedIn: false,
	userId:null,
	user:null
}

export const userSlice = createSlice({
	name:"user",
	initialState: initialState,
	reducers:{
		login:(state, action) =>{
			state.isLoggedIn = true
			state.user = action.payload
			localStorage.setItem("user", JSON.stringify(action.payload))
		},
		logout:(state)=>{
			state.isLoggedIn = false
			state.user = null
			localStorage.removeItem("user")
		},
		setUserId: (state, action) =>{
			state.userId = action.payload
		},
		setUser: (state,action) =>{
			state.user = action.payload
		}
	}
})

export const { login, logout, setUser, setUserId } = userSlice.actions;

export const userReducer =  userSlice.reducer