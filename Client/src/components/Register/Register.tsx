import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../hooks";
import { register, RegisterInformation } from "../../slices/userSlice";

export default function Register() {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
    paymentProviders: {
      provider: "",
      cardnumber: 0,
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pass === confirmPass && pass.length > 0) {
      setData({ ...data, password: pass });
    }
  }, [pass, confirmPass]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!data.password || !data.email) return;
    const registerInformation: RegisterInformation = {
      email: data.email,
      password: data.password,
    };

    console.log("registerInformation ", registerInformation);
    dispatch(register(registerInformation));
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
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        <div style={{ height: "50px" }}>
          {pass !== confirmPass && confirmPass.length > 0 ? (
            <p style={{ color: "red" }}>Passwords must be the same</p>
          ) : null}
        </div>

        <Button
          type="submit"
          sx={{ marginTop: "10px" }}
          variant="contained"
          onClick={handleClick}
        >
          Register
        </Button>
      </div>
    </Box>
  );
}
