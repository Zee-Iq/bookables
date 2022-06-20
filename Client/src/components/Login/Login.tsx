import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import {
  login,
  selectUser,
  selectLoginInError,
  setLoginError,
} from "../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loginError = useAppSelector(selectLoginInError);
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  let from = (location.state as any)?.from?.pathname || "/";

  console.log("from is", from);

  // if there is a user, login is sucessfull --> show homepage
  if (user) {
    dispatch(setLoginError(null));
    return <Navigate to={from} state={ location.state } replace />;
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data.password || !data.email)
      return dispatch(setLoginError("Email and Password are required"));
    dispatch(login({ email: data.email, password: data.password }));
  };

  const handleCreateAccount = () => {
    navigate("/register", { state: location.state });
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        marginTop: "70px",
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

        <p
          style={{
            marginTop: "50px",
            borderTop: "solid 1px gray",
            paddingTop: "50px",
          }}
        >
          If you do not have an account yet, please click the button below.
        </p>

        <Button
          type="submit"
          sx={{ marginTop: "10px" }}
          variant="contained"
          onClick={handleCreateAccount}
        >
          Create an account
        </Button>
      </div>
    </Box>
  );
}
