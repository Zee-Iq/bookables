import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data.password || !data.email) return;
    const response = await axios.post("/users/login", data);
   
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
      }}>
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

        <Button type="submit" 
        sx={{ marginTop: "10px" }}
        variant="contained" onClick={handleClick}>
          Login
        </Button>
      </div>
    </Box>
  );
}
