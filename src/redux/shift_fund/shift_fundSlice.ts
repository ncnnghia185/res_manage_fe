import { shiftFundServices } from "@/services";
import {
  GetDailyOpenShiftFundResponse,
  GetDetailShiftFund,
  OpenShiftFundData,
} from "@/services/apiResponse";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchShiftFundById = createAsyncThunk(
  "shiftFund/fetchById",
  async ({
    id,
    owner_id,
    restaurant_id,
    accessToken,
  }: {
    id: string;
    owner_id: number;
    restaurant_id: number;
    accessToken: string;
  }) => {
    const response: GetDetailShiftFund =
      await shiftFundServices.getDetailShiftFundById(
        id,
        owner_id,
        restaurant_id,
        accessToken
      );
    return response.data;
  }
);

export const fetchShiftFundByDate = createAsyncThunk(
  "shiftFund/fetchShiftFundByDate",
  async ({
    date,
    owner_id,
    restaurant_id,
    accessToken,
  }: {
    date: string;
    owner_id: number;
    restaurant_id: number;
    accessToken: string;
  }) => {
    const response: GetDailyOpenShiftFundResponse =
      await shiftFundServices.getShiftFundByDate(
        date,
        owner_id,
        restaurant_id,
        accessToken
      );
    return response.data;
  }
);

interface ShiftFundState {
  detailShiftFund: OpenShiftFundData;
  shiftFundByDate: OpenShiftFundData[];
  isOpenShiftFund: boolean;
  shift_fund_id: string;
}

const initialState: ShiftFundState = {
  detailShiftFund: {
    id: "",
    shift_date: "",
    open_time: "",
    end_time: "",
    open_cash: "",
    close_cash: "",
    total_revenue: "",
    expenses: "",
    notes: "",
  },
  shiftFundByDate: [],
  isOpenShiftFund: false,
  shift_fund_id: "",
};

const shiftFundSlice = createSlice({
  name: "shiftFund",
  initialState: initialState,
  reducers: {
    setOpenShiftFund: (state) => {
      state.isOpenShiftFund = true;
    },
    setCloseShiftFund: (state) => {
      state.isOpenShiftFund = false;
    },
    setCurrentShiftFundId: (state, action) => {
      state.shift_fund_id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShiftFundById.pending, (state, action) => {
        state.detailShiftFund = {
          id: "",
          shift_date: "",
          open_time: "",
          end_time: "",
          open_cash: "",
          close_cash: "",
          total_revenue: "",
          expenses: "",
          notes: "",
        };
      })
      .addCase(fetchShiftFundById.fulfilled, (state, action) => {
        state.detailShiftFund = action.payload;
      });
  },
});

export const { setOpenShiftFund, setCloseShiftFund, setCurrentShiftFundId } =
  shiftFundSlice.actions;

export const shiftFundReducer = shiftFundSlice.reducer;
