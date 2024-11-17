import { menuServices } from "@/services";
import { CategoryData, GetAllCategoriesResponse } from "@/services/apiResponse";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface CatagoryState {
  all_categories: CategoryData[];
	selected_category: number[],
	selected_all: boolean;
}
const initialState: CatagoryState = {
  all_categories: [],
	selected_category: [],
	selected_all: false
};

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async({
    accessToken,
    owner_id,
    restaurant_id,
  }: {
    accessToken: string;
    owner_id: number;
    restaurant_id: number;
  }) => {
    const response:GetAllCategoriesResponse = await menuServices.getAllCategories(accessToken, owner_id, restaurant_id)
    return response.data
  }
)

const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
    addCategories: (state, action: PayloadAction<CategoryData>) => {
      state.all_categories.push(action.payload);
    },
		selectCategories: (state, action:PayloadAction<number>) =>{
			const categoryId = action.payload
			if(state.selected_category.includes(categoryId)){
				state.selected_category = state.selected_category.filter(id => id !== categoryId)
			}else{
				state.selected_category.push(categoryId)
			}
			state.selected_all = state.selected_category.length === state.all_categories.length
		},
		selectAllCategories: (state) =>{
			if(state.selected_all){
				state.selected_category = []
			}else{
				state.selected_category = state.all_categories.map(category => category.id)
			}
			state.selected_all = !state.selected_all
		},
		deselectAllCategories: (state) => {
      state.selected_category = [];
    },
  },
  extraReducers: (builder) =>{
    builder
    .addCase(fetchAllCategories.fulfilled, (state,action) => {
      state.all_categories = action.payload
    })
    .addCase(fetchAllCategories.rejected, (state, action) => {
      state.all_categories = []
    })
  }
});

export const { addCategories, deselectAllCategories, selectAllCategories, selectCategories } =
  categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
