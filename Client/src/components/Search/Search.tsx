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
  Autocomplete,
  CircularProgress,
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
  setSelectedLocation,
  LabeledLocation,
} from "../../slices/filterSlice";

const isSameLocation = (
  location1: LabeledLocation,
  location2: LabeledLocation
) => {
  if (location1.label !== location2.label) return false;
  if (location1.point.coordinates[0] !== location2.point.coordinates[0])
    return false;
  if (location1.point.coordinates[1] !== location2.point.coordinates[1])
    return false;
  return true;
};

export default function Search(props: BoxProps) {
  const [showsAdditionalFilters, setShowsAdditionalFilters] = useState(false);

  const dispatch = useAppDispatch();
  const {
    fromDate,
    toDate,
    locationInput,
    searchRadius,
    types,
    locationSuggestions,
    selectedLocation,
    fetchingLocationSuggestions,
  } = useAppSelector(selectFilters);

  return (
    <Box
      {...{
        ...props,
        sx: {
          ...props.sx,
          "& .searchInput": { width: "100%", boxSizing: "border-box" },
          p: 2,
          display:{xs:"none", md:"block"}

        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        <Autocomplete
          filterOptions={(x) => x}
          disablePortal
          sx={{
            gridRow: { xs: "1", sm: "unset" },
            gridColumn: { xs: "1 / 3", sm: "unset" },
          }}
          id="combo-box-demo"
          options={locationSuggestions}
          clearOnEscape={true}
          clearOnBlur={true}
          inputValue={locationInput}
          value={selectedLocation}
          loading={fetchingLocationSuggestions}
          isOptionEqualToValue={isSameLocation}
          onChange={(_, value) => dispatch(setSelectedLocation(value))}
          onInputChange={(_, value) => {
            dispatch(setLocationInput(value));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="locationSearch"
              label="Location"
              type="text"
              variant="outlined"
              className="searchInput"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {fetchingLocationSuggestions ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => (
              <TextField
                {...props}
                className="searchInput"
                sx={{
                  gridRow: { xs: "2", sm: "unset" },
                  gridColumn: { xs: "1 / 2", sm: "unset" },
                }}
              />
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
              <TextField
                {...props}
                className="searchInput"
                sx={{
                  gridRow: { xs: "2", sm: "unset" },
                  gridColumn: { xs: "2 / 3", sm: "unset" },
                }}
              />
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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
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
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
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
