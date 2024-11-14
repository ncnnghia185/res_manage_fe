import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
interface authStateTypes {
  isLoggedIn: boolean;
  userId: number ;
  user: string;
}

const initialState: authStateTypes = {
  isLoggedIn: false,
  userId: 0,
  user: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      Cookies.set("isLoggedIn", state.user);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = "";
      state.userId = 0
      Cookies.remove("isLoggedIn");
    },
    setUserId: (state, action: PayloadAction<any>) => {
      state.userId = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser, setUserId } = userSlice.actions;

export const userReducer = userSlice.reducer;
