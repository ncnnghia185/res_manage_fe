import {
  GetAllLocationResponse,
  LocationData,
} from "@/services/apiResponse";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { tableServices } from "@/services";
interface LocationState {
  all_locations: LocationData[];
  selected_locations: number[];
  selected_all: boolean;
}

const initialState: LocationState = {
  all_locations: [],
  selected_locations: [],
  selected_all: false,
};

export const fetchAllLocations = createAsyncThunk(
  "location/fetchAll",
  async ({
    accessToken,
    owner_id,
    restaurant_id,
  }: {
    accessToken: string;
    owner_id?: number;
    restaurant_id?: number;
  }) => {
    const response: GetAllLocationResponse =
      await tableServices.getAllLocations(accessToken, owner_id, restaurant_id);
    return response.data;
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<LocationData>) => {
      state.all_locations.push(action.payload);
    },
    selectLocations: (state, action: PayloadAction<number>) => {
      const locationId = action.payload;
      if (state.selected_locations.includes(locationId)) {
        state.selected_locations = state.selected_locations.filter(
          (id) => id !== locationId
        );
      } else {
        state.selected_locations.push(locationId);
      }
      state.selected_all =
        state.selected_locations.length === state.all_locations.length;
    },
    selectAllLocations: (state) => {
      if (state.selected_all) {
        state.selected_locations = [];
      } else {
        state.selected_locations = state.all_locations.map(
          (location) => location.id
        );
      }
      state.selected_all = !state.selected_all;
    },
    deselectAllLocations: (state) => {
      state.selected_locations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLocations.fulfilled, (state, action) => {
        state.all_locations = action.payload;
      })
      .addCase(fetchAllLocations.rejected, (state, action) => {
        state.all_locations = [];
      });
  },
});

export const {
  addLocation,
  selectLocations,
  selectAllLocations,
  deselectAllLocations,
} = locationSlice.actions;
export const locationReducer = locationSlice.reducer;
