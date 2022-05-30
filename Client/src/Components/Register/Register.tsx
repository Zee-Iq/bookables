import * as React from "react";
import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function Register() {
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
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <h3>Payment Provider</h3>
        <TextField
          required
          id="outlined-required"
          label="Provider"
          type="text"
          value={data.paymentProviders.provider}
          onChange={(e) =>
            setData({
              ...data,
              paymentProviders: {
                ...data.paymentProviders,
                provider: e.target.value,
              },
            })
          }
        />

        <TextField
          required
          id="outlined-required"
          label="Card Number"
          type="number"
          value={(data.paymentProviders.cardnumber)}
          onChange={(e) =>
            setData({
              ...data,
              paymentProviders: {
                ...data.paymentProviders,
                cardnumber: parseInt(e.target.value),
              },
            })
          }
        />

        <TextField
          required
          id="outlined-required"
          label="Validation Number"
          type="number"
          value={data.paymentProviders.validationNumber}
          onChange={(e) =>
            setData({
              ...data,
              paymentProviders: {
                ...data.paymentProviders,
                validationNumber: parseInt(e.target.value)
              },
            })
          }
        />

        <TextField
          required
          id="outlined-required"
          label="Owner"
          type="text"
          value={data.paymentProviders.owner}
          onChange={(e) =>
            setData({
              ...data,
              paymentProviders: {
                ...data.paymentProviders,
                owner: e.target.value,
              },
            })
          }
        />

        <TextField
          required
          id="outlined-required"
          
          label="Expiration"
          type="date"
          value={data.paymentProviders.expiration}
          onChange={(e) =>
            setData({
              ...data,
              paymentProviders: {
                ...data.paymentProviders,
                expiration: e.target.value,
              },
            })
          }
        />

        <h3>Payout Information</h3>

        <TextField
          required
          id="outlined-required"
          label="BIC"
          type="text"
          value={data.payoutInformation.bic}
          onChange={(e) =>
            setData({
              ...data,
              payoutInformation: {
                ...data.payoutInformation,
                bic: e.target.value,
              },
            })
          }
        />

        <TextField
          required
          id="outlined-required"
          label="IBAN"
          type="text"
          value={data.payoutInformation.iban}
          onChange={(e) =>
            setData({
              ...data,
              payoutInformation: {
                ...data.payoutInformation,
                iban: e.target.value,
              },
            })
          }
        />

        <TextField
          required
          id="outlined-required"
          label="Owner"
          type="text"
          value={data.payoutInformation.owner}
          onChange={(e) =>
            setData({
              ...data,
              payoutInformation: {
                ...data.payoutInformation,
                owner: e.target.value,
              },
            })
          }
        />

        <Button type="submit" variant="contained" onClick={handleClick}>
          Register
        </Button>
      </div>
    </Box>
  );
}
