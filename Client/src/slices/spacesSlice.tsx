import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import Bookables from "types";
import axios from "axios";

interface SpacesState {
  spacesInArea: Bookables.Space[];
  ownedSpaces: Bookables.Space[];
  selectedSpace: Bookables.Space | null;
}

const initialState: SpacesState = {
  spacesInArea: [],
  ownedSpaces: [],
  selectedSpace: null,
};

const spacesSlice = createSlice({
  name: "spaces",
  initialState,
  reducers: {
    setOwnedSpaces(state, action: PayloadAction<Bookables.Space[]>) {
      state.ownedSpaces = action.payload;
    },
  },
});

export const fetchSpacesForHost = createAsyncThunk(
  "spaces/fetchSpacesForHost",
  async (_, thunkApi) => {
    const { dispatch } = thunkApi;
    const { setOwnedSpaces: setSpaces } = spacesSlice.actions;
    console.warn(
      "User should come from userSlice, still needs to be implemented."
    );
    const user = {
      _id: "628ca4a90b48ec82d91b06ec",
      email: { isConfirmed: true, address: "szymanekmilosz92@gmail.com" },
      roles: ["host", "tenant"],
    };
    console.warn(
      "token should come from userSlice, still needs to be implemented."
    );
    const token = "dwadowaijhowaifwaoindwa"

    if (!user || !user.roles.includes("host")) dispatch(setSpaces([]));
    const response = await axios.get<Bookables.Space[]>("spaces/owned", {headers: {"authorization": `bearer ${token}`}, validateStatus: () => true})
    if(response.status === 200) return dispatch(setSpaces(response.data))
    dispatch(setSpaces([]))
  }
);

// exporting filterReducer
const spacesReducer = spacesSlice.reducer;
export default spacesReducer;

// exporting selectors
export const selectSpacesInArea = (state: RootState) => state.spaces.spacesInArea;
export const seletOwnedSpaces = (state: RootState) => state.spaces.ownedSpaces;

// exporting actions
export const {} = spacesSlice.actions;
