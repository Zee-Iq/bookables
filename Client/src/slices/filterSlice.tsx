import { createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";
import { getMapSession } from "../components/Map/Map";
import env from "../config/env";


type South = Bookables.Latitude
type North = Bookables.Latitude
type West = Bookables.Longitude
type East = Bookables.Longitude
export type LabeledLocation = { label: string } & Bookables.Location & {bbox: [South, West, North, East]};


type Point = {type: "Point", coordinates: [number, number]}
type Box = {nw: number[], se: number[]}
interface FilterState {
  fromDate: string;
  toDate: string;
  locationInput: string;
  locationSuggestions: LabeledLocation[];
  fetchingLocationSuggestions: boolean;
  selectedLocation: LabeledLocation | null;
  mapCenter: Point | null,
  mapBox: Box | null,
  types: Bookables.BookableType[];
}
const initialState: FilterState = {
  fromDate: new Date().toISOString(),
  toDate: new Date().toISOString(),
  locationInput: "",
  locationSuggestions: [],
  fetchingLocationSuggestions: false,
  selectedLocation: null,
  mapCenter: null,
  mapBox: null,
  types: ["room", "seat"],
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
    setTypes: (state, action: PayloadAction<Bookables.BookableType[]>) => {
      state.types = action.payload;
    },
    setMapCenter: (state, action: PayloadAction<{longitude: number, latitude: number}>) => {
      state.mapCenter = {type: "Point", coordinates: [action.payload.longitude, action.payload.latitude]}
    },
    setMapBox: (state, action: PayloadAction<Box>) => {
      state.mapBox = action.payload
    },
    setSelectedLocation: (
      state,
      action: PayloadAction<LabeledLocation | null>
    ) => {
      state.selectedLocation = action.payload;
    },
    // resetting filter to initial state
    resetFilter: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(setLocationInput.fulfilled, (state, action) => {
        state.locationInput = action.payload;
        state.fetchingLocationSuggestions = action.payload.length > 0;
        state.locationSuggestions = [];
      })
      .addCase(fetchAutosuggest.fulfilled, (state, action) => {
        const unique = Array.from(
          new Map(action.payload.map((item) => [item["label"], item])).values()
        );
        state.locationSuggestions = unique
        state.fetchingLocationSuggestions = false;
      });
  },
});
// exporting filterReducer
const filterReducer = filterSlice.reducer;
export default filterReducer;
// exporting selectors
export const selectFilters = (state: RootState) => state.filter;
// exporting actions
const fetchAutosuggest = createAsyncThunk(
  "filter/fetchAutosuggest",
  async (query: string) => {
    const encodedQuery = encodeURIComponent(query)
    const key = (await getMapSession()) || env.REACT_APP_BING_MAPS
    const response = await fetch(`https://dev.virtualearth.net/REST/v1/Locations?key=${key}&query=${encodedQuery}&maxResults=${20}`);
    const locationSuggestions: (Bookables.Location & {bbox: [South, West, North, East]})[] = (await response.json()).resourceSets[0]?.resources;
    return locationSuggestions.map((suggestion) => ({
      label: suggestion.name,
      ...suggestion,
    }));
  }
);
export const setLocationInput = createAsyncThunk(
  "filter/setLocationInput",
  (() => {
    let timeout: null | NodeJS.Timeout = null;
    return async (input: string, thunkApi) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (input.length > 0) thunkApi.dispatch(fetchAutosuggest(input));
        timeout = null;
      }, 500);
      return input;
    };
  })()
);
export const {
  setToDate,
  setFromDate,
  resetFilter,
  setTypes,
  setSelectedLocation,
  setMapCenter,
  setMapBox
} = filterSlice.actions;


















