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

interface LoginInformation{
    email: string;
    password: string;
}

const login = createAsyncThunk("user/login", async (loginInformation:LoginInformation) => {
    const response = await axios.post("/api/login", 
        loginInformation)
})
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
    }
  },

});

export default userSlice.reducer;
