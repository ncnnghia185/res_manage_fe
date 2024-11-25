import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllTablesResponse,TableData } from "@/services/apiResponse";
import { tableServices } from "@/services";

interface TableState{
	all_tables: TableData[]
}
const initialState:TableState = {
	all_tables: []
}
export const fetchAllTables = createAsyncThunk(
  "tables/fetchAll",
  async ({
    accessToken,
    owner_id,
    restaurant_id,
  }: {
    accessToken: string;
    owner_id?: number;
    restaurant_id?: number;
  }) => {
    const response:GetAllTablesResponse  =
      await tableServices.getAllTables(accessToken, owner_id, restaurant_id);
    return response.data;
  }
);
export const tableSlice = createSlice({
	name:"table",
	initialState:initialState,
	reducers:{},
	extraReducers: (builder) => {
    builder
      .addCase(fetchAllTables.fulfilled, (state, action) => {
        state.all_tables = action.payload;
      })
      .addCase(fetchAllTables.rejected, (state, action) => {
        state.all_tables = [];
      });
  },
})

export const tableReducer = tableSlice.reducer;