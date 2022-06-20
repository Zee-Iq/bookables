import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import { update } from "../../slices/userSlice";
import { useAppDispatch } from "../../hooks";
import LabeledFormGroup from "../LabeledFormGroup/LabeledFormGroup";

export default function PayoutInformation() {
  const dispatch = useAppDispatch();

  const [data, setData] = useState({
    bic: "",
    iban: "",
    owner: "",
  });

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(update({ payoutInformation: data }));
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
          
        }}
      >
        <Typography variant="h6">
          Please provide your payout information
        </Typography>

        <LabeledFormGroup label="Payout Informations">
          <TextField
            style={{ width: "auto" }}
            required
            id="outlined-required-bic"
            label="BIC"
            type="text"
            value={data.bic}
            onChange={(e) => setData({ ...data, bic: e.target.value })}
          />

          <TextField
            style={{ width: "auto" }}
            id="outlined-required-iban"
            label="IBAN"
            type="text"
            value={data.iban}
            onChange={(e) => setData({ ...data, iban: e.target.value })}
          />

          <TextField
            style={{ width: "auto" }}
            id="outlined-required-owner"
            label="Owner"
            type="text"
            value={data.owner}
            onChange={(e) => setData({ ...data, owner: e.target.value })}
          />
        </LabeledFormGroup>

        <Button
          type="submit"
          sx={{ marginTop: "10px" }}
          variant="contained"
          onClick={handleClick}
        >
          Save
        </Button>
      </div>
    </Box>
  );
}
