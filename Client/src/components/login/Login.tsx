import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { login, selectUser, selectLoginInError, setLoginError } from "../../slices/userSlice";
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
  // if there is a user, login is sucessfull --> show homepage
  if (user) {
    return <Navigate to="/" />;
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data.password || !data.email) return dispatch(setLoginError("Email and Password are required"));
    dispatch(login({ email: data.email, password: data.password }));
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
        }}
      >
        <TextField
          error={!!loginError}
          required
          id="outlined-required"
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <TextField
          required
          error={!!loginError}
          helperText={loginError || " "}
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <Button
          type="submit"
          sx={{ marginTop: "10px" }}
          variant="contained"
          onClick={handleClick}
        >
          Login
        </Button>
      </div>
    </Box>
  );
}
