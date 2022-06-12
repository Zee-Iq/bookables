import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";
import axios from "axios";
import { selectToken, selectUser } from "./userSlice";
import { LabeledLocation } from "./filterSlice";

interface SpacesState {
  spacesInArea: Bookables.Space[];
  ownedSpaces: Bookables.Space[];
  selectedSpace: Bookables.Space | null;
  createdSpace: Bookables.Space | null;
  fetchingSpacesInArea: boolean,
  spacesInAreaError: null | unknown
}

const initialState: SpacesState = {
  spacesInArea: [],
  ownedSpaces: [],
  selectedSpace: null,
  createdSpace: null,
  fetchingSpacesInArea: false,
  spacesInAreaError: null
};

const spacesSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {
    setOwnedSpaces(state, action: PayloadAction<Bookables.Space[]>) {
      state.ownedSpaces = action.payload;
    },
    deleteOwnedSpace(state, action: PayloadAction<string>) {
      state.ownedSpaces = state.ownedSpaces.filter(
        (space) => (space._id as unknown as string) !== action.payload
      );
    },
    addOwnedSpace(state, action: PayloadAction<Bookables.Space>) {
      state.ownedSpaces.push(action.payload);
    },
    updateOwnedSpace(state, action: PayloadAction<Bookables.Space>) {
      state.ownedSpaces = state.ownedSpaces.map((space) =>
        space._id === action.payload._id ? action.payload : space
      );
    },
    setSpacesInArea(state, action: PayloadAction<Bookables.Space[]>) {
      state.spacesInArea = action.payload;
    },
    setCreatedSpace(state, action: PayloadAction<Bookables.Space | null>) {
      state.createdSpace = action.payload
    }
  },
});

export const fetchSpacesForHost = createAsyncThunk(
  "spaces/fetchSpacesForHost",
  async (_:never, thunkApi) => {
    const { dispatch } = thunkApi;
    const { setOwnedSpaces: setSpaces } = spacesSlice.actions;
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const token = selectToken(state);
    if (!user || !user.roles.includes("host") || !token)
      return dispatch(setSpaces([]));
    const response = await axios.get<Bookables.Space[]>("/spaces/owned", {
      headers: { authorization: `bearer ${token}` },
      validateStatus: () => true,
    });
    if (response.status === 200) return dispatch(setSpaces(response.data));
    dispatch(setSpaces([]));
  }
);


export const fetchSpacesInArea = createAsyncThunk(
  "spaces/fetchSpacesInArea",
  async (_: never, thunkApi) => {
    const { dispatch } = thunkApi;
    const { setSpacesInArea } = spacesSlice.actions;
    const {filter} = thunkApi.getState() as RootState
    const {mapBox} = filter
    if(!mapBox) throw {type: "spaceError", payload: "noSelectedSpace"};

    const response = await axios.get<Bookables.Space[]>("/spaces/availableinarea", {
      validateStatus: () => true, params: {
        nw: JSON.stringify(mapBox.nw),
        se: JSON.stringify(mapBox.se),
        from: filter.fromDate,
        to: filter.toDate,
        types: JSON.stringify(filter.types)
      }
    });
    
    if (response.status === 200)
      return dispatch(setSpacesInArea(response.data));
    dispatch(setSpacesInArea([]));
  }
);

export const deleteSpace = createAsyncThunk(
  "spaces/deleteSpace",
  async (spaceId: string, thunkApi) => {
    const { dispatch } = thunkApi;
    const { deleteOwnedSpace: deleteSpace } = spacesSlice.actions;
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const token = selectToken(state);
    if (!user || !user.roles.includes("host") || !token) return;
    const response = await axios.delete(`/spaces/${spaceId}/delete`, {
      headers: { authorization: `bearer ${token}` },
      validateStatus: () => true,
    });
    if (response.status === 200) return dispatch(deleteSpace(spaceId));
  }
);

export type SpaceInformation = Pick<
  Bookables.Space,
  "bookables" | "description" | "name"
> & {
  address: Omit<Bookables.Address, "_id">;
  contactInformation: Omit<Bookables.ContactInformation, "_id">;
};

export const createSpace = createAsyncThunk(
  "spaces/createSpace",
  async (space: SpaceInformation, thunkApi) => {
    const { dispatch } = thunkApi;
    const { addOwnedSpace, setCreatedSpace } = spacesSlice.actions;
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const token = selectToken(state);
    if (!user || !user.roles.includes("host") || !token) return;
    const response = await axios.post<Bookables.Space>(
      `/spaces/create`,
      space,
      {
        headers: { authorization: `bearer ${token}` },
        validateStatus: () => true,
      }
    );
    if (response.status === 201) {
      dispatch(addOwnedSpace(response.data));
      dispatch(setCreatedSpace(response.data));
      setTimeout(() => dispatch(setCreatedSpace(null)))
      
    }
  }
);

export type BookableInformation = Pick<Bookables.Bookable, "hourlyRate" | "name" | "type" | "spaceId"> 

export const addBookable = createAsyncThunk(
  "spaces/addBookable",
  async (bookable: BookableInformation, thunkApi) => {
    const { dispatch } = thunkApi;
    const { updateOwnedSpace } = spacesSlice.actions;
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const token = selectToken(state);
    if (!user || !user.roles.includes("host") || !token) return;
    const response = await axios.post<Bookables.Space>(
      `/spaces/${bookable.spaceId}/addBookable`,
      bookable,
      {
        headers: { authorization: `bearer ${token}` },
        validateStatus: () => true,
      }
    );
    if (response.status === 200) {
      dispatch(updateOwnedSpace(response.data))
    }
  }
);

export const updateBookable = createAsyncThunk(
  "spaces/updateBookable",
  async (bookable: Bookables.Bookable, thunkApi) => {
    const { dispatch } = thunkApi;
    const { updateOwnedSpace } = spacesSlice.actions;
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const token = selectToken(state);
    if (!user || !user.roles.includes("host") || !token) return;
    const response = await axios.patch<Bookables.Space>(
      `/spaces/${bookable.spaceId}/${bookable._id}/updateBookable`,
      bookable,
      {
        headers: { authorization: `bearer ${token}` },
        validateStatus: () => true,
      }
    );
    if (response.status === 200) {
      dispatch(updateOwnedSpace(response.data))
    }
  }
);

export const deleteBookable = createAsyncThunk(
  "spaces/updateBookable",
  async (bookable: Bookables.Bookable, thunkApi) => {
    const { dispatch } = thunkApi;
    const { updateOwnedSpace } = spacesSlice.actions;
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const token = selectToken(state);
    if (!user || !user.roles.includes("host") || !token) return;
    const response = await axios.delete<Bookables.Space>(
      `/spaces/${bookable.spaceId}/${bookable._id}/deleteBookable`,
      {
        headers: { authorization: `bearer ${token}` },
        validateStatus: () => true,
      }
    );
    if (response.status === 200) {
      dispatch(updateOwnedSpace(response.data))
    }
  }
);

type UpdateInformation = SpaceInformation & { spaceId: string };

export const updateSpace = createAsyncThunk(
  "spaces/updateSpace",
  async (update: UpdateInformation, thunkApi) => {
    const { dispatch } = thunkApi;
    const { updateOwnedSpace } = spacesSlice.actions;
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const token = selectToken(state);
    if (!user || !user.roles.includes("host") || !token) return;
    const response = await axios.patch<Bookables.Space>(
      `/spaces/${update.spaceId}/update`,
      update,
      {
        headers: { authorization: `bearer ${token}` },
        validateStatus: () => true,
      }
    );
    if (response.status === 200)
      return dispatch(updateOwnedSpace(response.data));
  }
);

// exporting filterReducer
const spacesReducer = spacesSlice.reducer;
export default spacesReducer;

// exporting selectors
export const selectSpacesInArea = (state: RootState) =>
  state.spaces.spacesInArea;
export const seletOwnedSpaces = (state: RootState) => state.spaces.ownedSpaces;

export const selectOwnedSpace =
  (id: string | undefined) => (state: RootState) =>
    id
      ? state.spaces.ownedSpaces.find(
          (space) => (space._id as unknown as string) === id
        )
      : null;

export const selectCreatedSpace = (state: RootState) =>
      state.spaces.createdSpace;

// exporting actions
//export const {} = spacesSlice.actions;
