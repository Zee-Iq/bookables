import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SuccessCondition } from "concurrently/dist/src/completion-listener";
import Bookables from "types";
import { RootState } from "../store";

// initialState

interface UserState {
  user: Bookables.ShareableUser | null;
  token: string | null;
  loginInProgress: boolean;
  loginError: string | null;
  regInProgress: boolean;
  regError: string | null;
  regSuccess: boolean;
}

const initialState: UserState = {
  user:
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") as string)
      : null,
  token: localStorage.getItem("token"),
  loginInProgress: false,
  loginError: null,
  regInProgress: false,
  regError: null,
  regSuccess: false,
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

// register action
export interface RegisterInformation {
  email: string;
  password: string;
}

export const register = createAsyncThunk(
  "user/register",
  async (registerInformation: RegisterInformation, thunkApi) => {
    const response = await axios.post<{ success: boolean }>(
      "users/register",
      registerInformation
    );
    if (response.data.success)
      thunkApi.dispatch(userSlice.actions.setRegSuccess(true));
    else throw new Error("something went wrong");
  }
);

// 1. set registration is in progress
// 2. api call user/register , with registar info
// 3. if sucessfull response --> set registration not in progress anymore
// when not successfull --> set registration error, stay on registration form and say not in progress anymore

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
    setRegError: (state, action: PayloadAction<string>) => {
      state.regError = action.payload;
    },
    setRegSuccess: (state, action: PayloadAction<boolean>) => {
      state.regSuccess = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.regInProgress = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.regInProgress = false;
        state.regSuccess = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.regInProgress = false;
        state.regError = action.error.message || "Unknown Error";
        state.regSuccess = false;
      });
  },
});

export default userSlice.reducer;

// selectors
// select user
export const selectUser = (state: RootState) => state.user.user;
export const selectLoginInProgress = (state: RootState) =>
  state.user.loginInProgress;
export const selectToken = (state: RootState) => state.user.token;
export const selectLoginInError = (state: RootState) => state.user.loginError;

export const selectRegInProgress = (state: RootState) =>
  state.user.regInProgress;
export const selectRegSuccess = (state: RootState) => state.user.regSuccess;
export const selectRegError = (state: RootState) => state.user.regError;

export const {logout, setLoginError} = userSlice.actions
