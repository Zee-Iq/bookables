import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { login, selectUser, selectLoginInError } from "../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Navigate } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loginError = useAppSelector(selectLoginInError);

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  console.log(user)
  // if there is a user, login is sucessfull --> show homepage
  if (user) {
    return <Navigate to="/" />;
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data.password || !data.email) return;
    dispatch(login({email:data.email, password:data.password}))
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <h1>Login</h1>
      <div>
        <TextField
          required
          id="outlined-required"
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <Button type="submit" variant="contained" onClick={handleClick}>
          Login
        </Button>
      </div>
    </Box>
  );
}
