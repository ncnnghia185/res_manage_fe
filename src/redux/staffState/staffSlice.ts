import { staffInfoServices } from "@/services";
import { AllStaffData, GetAllStaffResponse } from "@/services/apiResponse";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllStaffs = createAsyncThunk(
    "staff/allStaffs",
    async ({owner_id, restaurant_id,accessToken}:{owner_id:number, restaurant_id:number, accessToken:string}) =>{
        const response:GetAllStaffResponse = await staffInfoServices.getAllStaff(owner_id, restaurant_id, accessToken)
        return response.data
    }
)

const initalState = {
    all_staffs: [] as AllStaffData[]  
}
export const staffInfoSlice = createSlice({
    name:"staff_info",
    initialState: initalState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(
            fetchAllStaffs.fulfilled, (state, action) =>{
                state.all_staffs = action.payload
            }
        ).addCase(fetchAllStaffs.pending, (state, action) =>{
            state.all_staffs = []
        }).addCase(fetchAllStaffs.rejected, (state,action) =>{
            state.all_staffs = []
        } )
    }
})

export const staffInfoReducer = staffInfoSlice.reducer