import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import spacesReducer from "./slices/spacesSlice";





export const store = configureStore({
  reducer: {
    filter: filterReducer,
    spaces: spacesReducer
    //user: userReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
