import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryType {
  id: number;
  name: string;
}

interface CatagoryState {
  categories: CategoryType[];
	selected_category: number[],
	selected_all: boolean;
}

const initialState: CatagoryState = {
  categories: [],
	selected_category: [],
	selected_all: false
};
const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<CategoryType>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<CategoryType>) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
    },
		selectCategories: (state, action:PayloadAction<number>) =>{
			const categoryId = action.payload
			if(state.selected_category.includes(categoryId)){
				state.selected_category = state.selected_category.filter(id => id !== categoryId)
			}else{
				state.selected_category.push(categoryId)
			}
			state.selected_all = state.selected_category.length === state.categories.length
		},
		selectAllCategories: (state) =>{
			if(state.selected_all){
				state.selected_category = []
			}else{
				state.selected_category = state.categories.map(category => category.id)
			}
			state.selected_all = !state.selected_all
		},
		deselectAllCategories: (state) => {
      state.selected_category = [];
    },
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory, deselectAllCategories, selectAllCategories, selectCategories } =
  categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
