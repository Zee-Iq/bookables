import { Box, Button, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectFilters, setFromDate, setLocationInput, setToDate } from "../../slices/filterSlice";



export default function Search() {
  const [showsAdditionalFilters, setShowsAdditionalFilters] = useState(false);

  const dispatch = useAppDispatch();
  const { fromDate, toDate, locationInput} =
    useAppSelector(selectFilters);

  return (
    <Box>
      <Box>
        <TextField
          id="location-search"
          label="Location"
          type="Location"
          variant="outlined"
          value={locationInput}
          onChange={(e) => dispatch(setLocationInput(e.target.value))}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="From"
            value={fromDate}
            onChange={(date: unknown) => {
              date instanceof Date && dispatch(setFromDate(date.toISOString()));
            }}
          />
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="To"
            value={toDate}
            onChange={(date: unknown) => {
              date instanceof Date && dispatch(setFromDate(date.toISOString()));
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
