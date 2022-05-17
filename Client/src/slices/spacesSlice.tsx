import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  AsyncThunkPayloadCreator,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";

interface SpacesState {
  spacesInArea: Bookables.Space[];
  selectedSpace: Bookables.Space | null;
}

const initialState: SpacesState = {
  spacesInArea: [
    {
      address: {
        countryCode: "DE",
        houseNumber: "20",
        name: "Jimmys",
        postalCode: "46540",
        streetName: "Bla",
      },
      contactInformation: { email: "k@k.de", phoneNumber: "123456" },
      description: "dwadwa",
      name: "dwadwadwa",
      owner: "dwadwa",
      point: {
        type: "Point",
        coordinates: [51.4821662902832, 11.96579647064209],
      },
    },
  ],
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
export const {} = spacesSlice.actions;
