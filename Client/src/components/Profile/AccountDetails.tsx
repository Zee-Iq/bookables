import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import { selectUser } from "../../slices/userSlice";
import { useAppSelector, useAppDispatch } from "../../hooks";
import LabeledFormGroup from "../LabeledFormGroup/LabeledFormGroup";

const AccountDetails = () => {
  const loggedInUser = useAppSelector(selectUser);
 console.log("loggedInUser ", loggedInUser);

  return (
    <Box
      component="form"
      sx={{
        marginTop: "70px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Your account details</Typography>

        <LabeledFormGroup label="Account Details">
          <TextField value={loggedInUser?.email.address} />

          <TextField value="*********" />
        </LabeledFormGroup>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <Button type="submit" sx={{ marginTop: "10px" }} variant="contained">
            Update
          </Button>
          <Button type="submit" sx={{ marginTop: "10px" }} variant="contained">
            Cancel
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default AccountDetails;
