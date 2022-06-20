import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import LabeledFormGroup from "../LabeledFormGroup/LabeledFormGroup";
import { useAppDispatch } from "../../hooks";
import { update } from "../../slices/userSlice";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { isBefore, subDays } from "date-fns";
import { selectUser } from "../../slices/userSlice";
import { useAppSelector } from "../../hooks";
import { Navigate, useLocation } from "react-router-dom";

export default function PaymentProvider() {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectUser);
  const location = useLocation();

  const [data, setData] = useState<{
    cardnumber: number | null;
    validationNumber: number | null;
    owner: string;
    expiration: Date | null;
  }>({
    cardnumber: null,
    validationNumber: null,
    owner: "",
    expiration: subDays(new Date(), 1),
  });

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { cardnumber, expiration, owner, validationNumber } = data;

    if (cardnumber === null || validationNumber === null || expiration === null)
      return;

    dispatch(
      update({
        paymentProviders: {
          cardnumber,
          expiration,
          validationNumber,
          owner,
          provider: "creditcard",
        },
      })
    );

  
  };

  if (loggedInUser?.roles.includes("tenant")) {
    return <Navigate to={(location.state as any)?.from?.pathname} state={location.state} replace />;
  }
  else if (!loggedInUser) return <Navigate to="/" />

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
        <LabeledFormGroup label="Payment Provider">
          <TextField
          style={{width: "auto"}}
            required
            id="outlined-required-iban"
            label="Card Number"
            type="number"
            value={data.cardnumber === null ? "" : data.cardnumber}
            onChange={(e) =>
              setData({ ...data, cardnumber: Number(e.target.value) })
            }
          />

          <TextField
          style={{width: "auto"}}
            required
            id="outlined-required-owner"
            label="Validation Number"
            type="number"
            value={data.validationNumber === null ? "" : data.validationNumber}
            onChange={(e) =>
              setData({ ...data, validationNumber: Number(e.target.value) })
            }
          />

          <TextField
          style={{width: "auto"}}
            required
            id="outlined-required-owner"
            label="Owner"
            type="text"
            value={data.owner}
            onChange={(e) => setData({ ...data, owner: e.target.value })}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            
              label="Expiration"
              value={data.expiration}
              onChange={(newDate) => setData({ ...data, expiration: newDate })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={
                    !!data.expiration && isBefore(data.expiration, new Date())
                  }
                  required
                />
              )}
            />
          </LocalizationProvider>
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
