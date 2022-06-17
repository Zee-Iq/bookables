import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import reservationReducer from "./slices/reservationSlice";
import spacesReducer from "./slices/spacesSlice";
import userReducer from "./slices/userSlice";




export const store = configureStore({
  reducer: {
    filter: filterReducer,
    spaces: spacesReducer,
    user: userReducer,
    reservation: reservationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
