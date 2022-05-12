import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, dispatch } from "../store";
import Bookables from "types";

type Location =
  | {
      __type: "Address";
      address: Partial<{
        countryRegion: string;
        locality: string;
        adminDistrict: string;
        adminDistrict2: string;
        countryRegionIso2: string;
        houseNumber: string;
        addressLine: string;
        streetName: string;
        formattedAddress: string;
        neighborhood: string;
        postalCode: string;
      }>;
    }
  | {
      __type: "Place";
      address: Partial<{
        countryRegion: string;
        locality: string;
        adminDistrict: string;
        adminDistrict2: string;
        countryRegionIso2: string;
        formattedAddress: string;
      }>;
    }
  | {
      __type: "LocalBusiness";
      address: Partial<{
        countryRegion: string;
        locality: string;
        adminDistrict: string;
        countryRegionIso2: string;
        postalCode: string;
        addressLine: string;
        formattedAddress: string;
      }>;
      name?: string;
    };

interface FilterState {
  fromDate: string;
  toDate: string;
  locationInput: string;
  locationSuggestions: Location[];
  searchRadius: number;
  types: Bookables.BookableType[];
}

const initialState: FilterState = {
  fromDate: new Date().toISOString(),
  toDate: new Date().toISOString(),
  locationInput: "",
  locationSuggestions: [],
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
    // resetting filter to initial state
    resetFilter: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(setLocationInput.fulfilled, (state, action) => {
        state.locationInput = action.payload;
      })
      .addCase(fetchAutosuggest.fulfilled, (state, action) => {
        state.locationSuggestions = action.payload;
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
    const response = await fetch(
      `http://dev.virtualearth.net/REST/v1/Autosuggest?query=${query}&userLocation=0,0,40000&includeEntityTypes=Address,Place&countryFilter=DE&key=${process.env.REACT_APP_BING_MAPS}`
    );
    console.log(await response.json());
    const locationSuggestions: Location[] = (await response.json())
      .resourceSets[0].resources[0].value;
    return locationSuggestions;
  }
);

export const setLocationInput = createAsyncThunk(
  "filter/setLocationInput",
  (() => {
    let timeout: null | NodeJS.Timeout = null;

    return async (input: string, thunkApi) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        thunkApi.dispatch(fetchAutosuggest(input));
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
} = filterSlice.actions;
