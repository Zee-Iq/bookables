import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface FilterState {
  fromDate: string;
  toDate: string;
  locationInput: string;
}

const initialState: FilterState = {
  fromDate: (new Date()).toISOString(),
  toDate: (new Date()).toISOString(),
  locationInput: "",
};

// defining generics example
/* interface Action<payloadType>  { type: string; payload: payloadType };

const action1: Action<number> = {
  type: "fist ",
  payload: 4, 
};
*/

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setToDate: (state, action: PayloadAction<string>) => {
      state.toDate = action.payload;
    },
    setFromDate: (state, action: PayloadAction<string>) => {
      state.fromDate = action.payload;
    },
    setLocationInput: (state, action: PayloadAction<string>) => {
      state.locationInput = action.payload;
    },
    // resetting filter to initial state
    resetFilter: () => initialState,
  },
});

// exporting filterReducer
const filterReducer = filterSlice.reducer;
export default filterReducer;

// exporting selectors

export const selectFilters = (state: RootState) => state.filter;

// exporting actions

export const { setToDate, setFromDate, setLocationInput, resetFilter } =
  filterSlice.actions;
