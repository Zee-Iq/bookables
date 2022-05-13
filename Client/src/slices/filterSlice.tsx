import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";

type Latitude = number;
type Longitude = number;

type Point = {
  type: "Point";
  coordinates: [Latitude, Longitude];
};

type Location = {
  name: string;
  point: Point;
  address: Partial<{
    addressLine: string;
    locality: string;
    neighborhood: string;
    adminDistrict: string;
    adminDistrict2: string;
    formattedAddress: string;
    postalCode: string;
    countryRegion: string;
    countryRegionIso2: string;
    landmark: string;
  }>;
};

export type LabeledLocation = { label: string } & Location;

interface FilterState {
  fromDate: string;
  toDate: string;
  locationInput: string;
  locationSuggestions: LabeledLocation[];
  fetchingLocationSuggestions: boolean;
  selectedLocation: LabeledLocation | null;
  searchRadius: number;
  types: Bookables.BookableType[];
}

const initialState: FilterState = {
  fromDate: new Date().toISOString(),
  toDate: new Date().toISOString(),
  locationInput: "",
  locationSuggestions: [],
  fetchingLocationSuggestions: false,
  selectedLocation: null,
  searchRadius: 10,
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
    setSearchRadius: (state, action: PayloadAction<number>) => {
      state.searchRadius = action.payload;
    },
    setTypes: (state, action: PayloadAction<Bookables.BookableType[]>) => {
      state.types = action.payload;
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
        console.log("action", action);
        state.locationSuggestions = action.payload;
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
  async (query: string, thunkApi) => {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(`http://dev.virtualearth.net/REST/v1/Locations?key=${process.env.REACT_APP_BING_MAPS}&query=${encodedQuery}`);
    const locationSuggestions: Location[] = (await response.json()).resourceSets[0]?.resources;
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
  setSearchRadius,
  setTypes,
  setSelectedLocation,
} = filterSlice.actions;
