import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  BoxProps,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectFilters,
  setFromDate,
  setLocationInput,
  setToDate,
  setSearchRadius,
  setTypes,
} from "../../slices/filterSlice";

export default function Search(props: BoxProps) {
  const [showsAdditionalFilters, setShowsAdditionalFilters] = useState(false);

  const dispatch = useAppDispatch();
  const { fromDate, toDate, locationInput, searchRadius, types } =
    useAppSelector(selectFilters);

  return (
    <Box
      {...{
        ...props,
        sx: {
          ...props.sx,
          "& .searchInput": { width: "100%", boxSizing: "border-box" },
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { sx: "1fr", sm: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        <TextField
          id="locationSearch"
          label="Location"
          type="text"
          variant="outlined"
          className="searchInput"
          value={locationInput}
          onChange={(e) => dispatch(setLocationInput(e.target.value))}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => (
              <TextField {...props} className="searchInput" />
            )}
            label="From"
            value={fromDate}
            onChange={(date: unknown) => {
              try {
                date instanceof Date &&
                  dispatch(setFromDate(date.toISOString()));
              } catch (error) {}
            }}
            ampm={false}
          />
          <DateTimePicker
            renderInput={(props) => (
              <TextField {...props} className="searchInput" />
            )}
            label="To"
            value={toDate}
            onChange={(date: unknown) => {
              try {
                date instanceof Date && dispatch(setToDate(date.toISOString()));
              } catch (error) {}
            }}
            ampm={false}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <Button
          variant="text"
          endIcon={
            showsAdditionalFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />
          }
          onClick={() => setShowsAdditionalFilters(!showsAdditionalFilters)}
        >
          <Typography>More Filters</Typography>
        </Button>
        {showsAdditionalFilters ? (
          <Box
            sx={{
              pt: 2,
              display: "grid",
              gridTemplateColumns: { sx: "1fr", sm: "1fr 1fr 1fr" },
              gap: 2,
            }}
          >
            <FormControl className="searchInput">
              <InputLabel id="typeLabel">Bookable Type</InputLabel>
              <Select
                labelId="typeLabel"
                id="typeSelect"
                label="Bookable Type"
                value={types}
                onChange={(e) => {
                  console.log(e.target.value);
                  dispatch(
                    setTypes(
                      Array.isArray(e.target.value) ? e.target.value : types
                    )
                  );
                }}
                renderValue={(selected) => selected.join(", ")}
                multiple
              >
                <MenuItem value={"room"}>
                  <Checkbox checked={types.indexOf("room") > -1} />
                  <ListItemText primary="Room" />
                </MenuItem>
                <MenuItem value={"seat"}>
                  <Checkbox checked={types.indexOf("seat") > -1} />
                  <ListItemText primary="Seat" />
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="radius"
              label="Search Radius (km)"
              type="number"
              variant="outlined"
              value={searchRadius}
              onChange={(e) =>
                dispatch(setSearchRadius(Number.parseInt(e.target.value)))
              }
              className="searchInput"
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
