import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface orderType{
    orderId:string
    tableId:number
}

interface OrderState {
    created_order: orderType
}

const initialState: OrderState = {
    created_order: {
        orderId: "",
        tableId: 0
    }
}

const orderSlice = createSlice({
    name:"order",
    initialState:initialState,
    reducers:{
        setCreatedOrder : (state, action:PayloadAction<orderType>) => {
            state.created_order = action.payload
        }
    }
})

export const { setCreatedOrder } = orderSlice.actions
export const orderReducer = orderSlice.reducer