import { Box, Button, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";

//Should select all the available Filters and return them as a object
function selectFilters(): {
  fromDate: Date;
  toDate: Date;
  location: string;
} {
  return {
    fromDate: new Date(),
    toDate: new Date( ),
    location: ""
  };
}

//Required Actions:
//Takes a new ToDate, the Reducer should store this new ToDate in the store
function setToDate(date: Date): any {}
//Takes a new FromDate, the Reducer should store this new FromDate in the store
function setFromDate(date: Date): any {}
//Takes a new Location, the Reducer should store this location in the store
function setLocation(location: string): any {}

export default function Search() {
  const [showsAdditionalFilters, setShowsAdditionalFilters] = useState(false);

  const dispatch = useAppDispatch();
  const { fromDate, toDate, location} =
    useAppSelector(selectFilters);

  return (
    <Box>
      <Box>
        <TextField
          id="location-search"
          label="Location"
          type="Location"
          variant="outlined"
          value={location}
          onChange={(e) => dispatch(setLocation(e.target.value))}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="From"
            value={fromDate}
            onChange={(newValue) => {
              newValue && dispatch(setFromDate(newValue));
            }}
          />
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="To"
            value={toDate}
            onChange={(newValue) => {
              newValue && dispatch(setToDate(newValue));
            }}
          />
        </LocalizationProvider>
      </Box>
      <Box>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="text"
            endIcon={
              showsAdditionalFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }
            onClick={() => setShowsAdditionalFilters(!showsAdditionalFilters)}
          >
            <Typography>More Filters</Typography>
          </Button>
        </Box>
        {showsAdditionalFilters ? <Box>Additional Filters here</Box> : null}
      </Box>
    </Box>
  );
}
