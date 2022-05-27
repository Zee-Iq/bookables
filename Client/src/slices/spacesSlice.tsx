import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  AsyncThunkPayloadCreator,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";

interface SpacesState {
  spaces: Bookables.Space[];
  selectedSpace: Bookables.Space | null;
}

const initialState: SpacesState = {
  spaces: [],
  selectedSpace: null,
};

const spacesSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {},
});

export const fetchSpacesForHost = createAsyncThunk<Bookables.Space[]>("spaces/fetchSpacesForHost", () => {
  console.warn("User should come from userSlice, still needs to be implemented.")
  const user = {
    _id: "628ca4a90b48ec82d91b06ec",
    email: { isConfirmed: true, address: "szymanekmilosz92@gmail.com" },
    roles: ["host", "tenant"]
  }

  if(!user || !user.roles.includes("host")) return [];
  return []
})


// exporting filterReducer
const spacesReducer = spacesSlice.reducer;
export default spacesReducer;

// exporting selectors
export const selectSpaces = (state: RootState) => state.spaces.spaces;

// exporting actions
export const {} = spacesSlice.actions;
