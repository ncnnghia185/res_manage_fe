import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalStateTypes{
	isSidebarCollapsed: boolean;
	isDarkMode: boolean;
	language: string
}

const initialGlobalState: GlobalStateTypes = {
	isSidebarCollapsed: false,
  isDarkMode: false,
	language: "vi"
};


export const globalSlice = createSlice({
	name: "global",
	initialState: initialGlobalState,
	reducers:{
		setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) =>{
			state.isSidebarCollapsed = action.payload
		},
		setIsDarkMode: (state, action: PayloadAction<boolean>) => {
			state.isDarkMode = action.payload
		},
		setLanguage: (state, action:PayloadAction<string>) =>{
			state.language = action.payload
		}
	}
})

export const {setIsSidebarCollapsed, setIsDarkMode, setLanguage} = globalSlice.actions

export const globalReducer =  globalSlice.reducer