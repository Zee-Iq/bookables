import * as React from "react";
import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function Register() {
  const [pass, setPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [data, setData] = useState({
    email: "",
    password: "",
    paymentProviders: {
      provider: "",
      cardnumber:0,
      validationNumber: 0,
      owner: "",
      expiration: "",
    },
    payoutInformation: {
      bic: "",
      iban: "",
      owner: "",
    },
  });

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

    
      
      
    

    if (!data.password || !data.email) return;

    const response = await axios.post("/users/register", data);
   
  };

  const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    if((pass === confirmPass) && pass.length > 0 ) {

      setData({ ...data, password: pass })

    }

  }
  
  

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
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
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <TextField
          id="outlined-password-input2"
          label="Repeat Password"
          type="password"
          autoComplete="current-password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value )}
        />
      

        <Button type="submit" variant="contained" onClick={handleClick}>
          Register
        </Button>
      </div>
    </Box>
  );
}
