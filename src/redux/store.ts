// import { configureStore } from "@reduxjs/toolkit";
// import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
// import { globalReducer } from "@/redux/globalState/globalSlice";
// import { userReducer } from "@/redux/authState/authSlice";
// export const store = configureStore({
//   reducer: { global: globalReducer, auth:userReducer},
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import storage from "redux-persist/lib/storage";
import { globalReducer } from "@/redux/globalState/globalSlice";
import { userReducer } from "@/redux/authState/authSlice";
import { categoryReducer } from "@/redux/menuState/categorySlice";
import { restaurantReducer } from "@/redux/restaurantState/restaurantSlice";
import { locationReducer } from "@/redux/tableState/locationSlice";
import { tableReducer } from "@/redux/tableState/tableSlice";
import { menuItemReducer } from "./menuState/menuSlice";
import { shiftFundReducer } from "./shift_fund/shift_fundSlice";
import { orderReducer } from "./orderState/orderSlice";

const rootReducer = combineReducers({
  global: globalReducer,
  auth: userReducer,
  category: categoryReducer,
  restaurant: restaurantReducer,
  location: locationReducer,
  table: tableReducer,
  menu_item: menuItemReducer,
  shift_fund:shiftFundReducer,
  order:orderReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "global", "restaurant","shift_fund"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
