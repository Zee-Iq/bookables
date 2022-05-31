import {
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";

interface SpacesState {
  spacesInArea: Bookables.Space[];
  selectedSpace: Bookables.Space | null;
}

const initialState: SpacesState = {
  spacesInArea: [],
  selectedSpace: null,
};

const spacesSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {},
});

// exporting filterReducer
const spacesReducer = spacesSlice.reducer;
export default spacesReducer;

// exporting selectors
export const selectSpaces = (state: RootState) => state.spaces.spacesInArea;

// exporting actions
//export const {} = spacesSlice.actions;
