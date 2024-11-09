import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface RestaurantType {
  id: number;
  name: string;
}
interface RestaurantState {
  allRestaurants: RestaurantType[];
  selected_restaurants: RestaurantType | null;
}

const initialState: RestaurantState = {
  allRestaurants: [],
  selected_restaurants: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {
    setAllRestaurants: (state, action: PayloadAction<RestaurantType[]>) => {
      state.allRestaurants = action.payload;

      if (state.allRestaurants.length > 0) {
        state.selected_restaurants = state.allRestaurants.reduce(
          (prev, current) => (current.id > prev.id ? current : prev)
        );
      } else {
        state.selected_restaurants = null;
      }
    },
    addRestaurant: (state, action: PayloadAction<RestaurantType>) => {
      state.allRestaurants.push(action.payload);
			if(!state.selected_restaurants || action.payload.id > state.selected_restaurants.id){
				state.selected_restaurants = action.payload
			}
    },
    setSelectedRestaurant: (state, action: PayloadAction<number>) => {
			const found = state.allRestaurants.find(restaurant => restaurant.id === action.payload)
			if (found) state.selected_restaurants = {id: found.id, name: found.name}
		},
  },
});

export const {setAllRestaurants, addRestaurant, setSelectedRestaurant} = restaurantSlice.actions
export const restaurantReducer = restaurantSlice.reducer