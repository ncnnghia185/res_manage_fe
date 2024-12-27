import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {MenuItemData, GetAllMenuItemResponse} from "@/services/apiResponse"
import { menuServices } from "@/services";
interface MenuItemState{
	all_menu_items: MenuItemData[]
}

const initialState: MenuItemState = {
	all_menu_items: []
}

export const fetchAllMenuItems = createAsyncThunk(
	"menu/fetchAll",
	async({accessToken, owner_id, restaurant_id} : {accessToken:string,owner_id:number, restaurant_id:number} ) =>{
		const response:GetAllMenuItemResponse = await menuServices.getAllMenu(accessToken,owner_id, restaurant_id)
		return response.data
	}
)

export const menuItemSlice = createSlice({
	name:"menu_item",
	initialState:initialState,
	reducers:{},
	extraReducers:(builder) =>{
		builder.addCase(fetchAllMenuItems.fulfilled, (state, action) =>{
			state.all_menu_items = action.payload
		}).addCase(fetchAllMenuItems.pending, (state, action) =>{
			state.all_menu_items = []
		}).addCase(fetchAllMenuItems.rejected, (state, action)=>{
			state.all_menu_items = []
		} )
	}
})

export const menuItemReducer = menuItemSlice.reducer