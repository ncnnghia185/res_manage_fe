import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface RestaurantType {
  id: number;
  name: string;
}
interface RestaurantState {
  allRestaurants: RestaurantType[];
  selected_restaurant: RestaurantType ;
}

const initialState: RestaurantState = {
  allRestaurants: [],
  selected_restaurant: {
    id: 0,
    name: "",
  },
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {
    setAllRestaurants: (state, action: PayloadAction<RestaurantType[]>) => {
      state.allRestaurants = action.payload;

      if (state.allRestaurants.length > 0) {
        state.selected_restaurant = state.allRestaurants.reduce(
          (prev, current) => (current.id > prev.id ? current : prev)
        );
      } else {
        state.selected_restaurant = {
          id: 0,
          name: "",
        };
      }
    },
    addRestaurant: (state, action: PayloadAction<RestaurantType>) => {
      state.allRestaurants.push(action.payload);
			if(!state.selected_restaurant || action.payload.id > state.selected_restaurant.id){
				state.selected_restaurant = action.payload
			}
    },
    setSelectedRestaurant: (state, action: PayloadAction<number>) => {
			const found = state.allRestaurants.find(restaurant => restaurant.id === action.payload)
			if (found) state.selected_restaurant = {id: found.id, name: found.name}
		},
  },
});

export const {setAllRestaurants, addRestaurant, setSelectedRestaurant} = restaurantSlice.actions
export const restaurantReducer = restaurantSlice.reducer