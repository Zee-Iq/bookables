import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Bookables from "types";

// initialState

interface UserState {
  user: Bookables.ShareableUser | null;
  token: string | null;
  loginInProgress: boolean;
  loginError: string | null;
}

const initialState: UserState = {
  user:
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") as string)
      : null,
  token: localStorage.getItem("token"),
  loginInProgress: false,
  loginError: null,
};

// login action

interface LoginInformation {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  "user/login",
  async (loginInformation: LoginInformation, thunkApi) => {
    thunkApi.dispatch(userSlice.actions.setLoginInProgress(true));
    const response = await axios.post<
      | { success: false; loginError: string }
      | { success: true; token: string; user: Bookables.ShareableUser }
    >("/users/login", loginInformation);
    if (response.data.success) {
      thunkApi.dispatch(userSlice.actions.setToken(response.data.token));
      thunkApi.dispatch(userSlice.actions.setUser(response.data.user));
    } else {
      thunkApi.dispatch(
        userSlice.actions.setLoginError(response.data.loginError)
      );
    }
    thunkApi.dispatch(userSlice.actions.setLoginInProgress(false));
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Bookables.ShareableUser>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setLoginInProgress: (state, action: PayloadAction<boolean>) => {
      state.loginInProgress = action.payload;
    },
    setLoginError: (state, action: PayloadAction<string>) => {
      state.loginError = action.payload;
    },
  },
});

export default userSlice.reducer;
