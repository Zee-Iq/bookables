import {
  List,
  ListProps,
  ListItem,
  Button,
  Box,
  Typography,
} from "@mui/material";
import Bookables from "types";
import moment from "moment";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "../../slices/filterSlice";
import { useMemo } from "react";

type BookablesListProps = { bookables: Bookables.Bookable[] } & ListProps;

export default function BookablesList({
  bookables,
  ...props
}: BookablesListProps) {
  const { fromDate, toDate } = useAppSelector(selectFilters);
  const { seats, rooms } = bookables.reduce(
    (split, bookable) => {
      if (bookable.type === "room") split.rooms.push(bookable);
      if (bookable.type === "seat") split.seats.push(bookable);
      return split;
    },
    { seats: [] as Bookables.Bookable[], rooms: [] as Bookables.Bookable[] }
  );

  const timeWindow = useMemo(() => Math.abs(moment(fromDate).diff(moment(toDate), "hours", true)), [fromDate, toDate])
  return (
    <Box>
      {seats.length > 0 ? (
        <>
          <Typography variant="h6">Seats</Typography>
          <List {...props}>
            {seats.map((bookable) => (
              <ListItem
                key={bookable._id as unknown as string}
                sx={{ justifyContent: "space-between" }}
              >
                {bookable.name}
                <Button>
                  Book for{" "}
                  {(
                    timeWindow *
                    (bookable.hourlyRate / 100)
                  ).toFixed(2)}
                  €
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      ) : null}

      {rooms.length > 0 ? (
        <>
          <Typography variant="h6">Rooms</Typography>
          <List {...props}>
            {rooms.map((bookable) => (
              <ListItem
                key={bookable._id as unknown as string}
                sx={{ justifyContent: "space-between" }}
              >
                {bookable.name}
                <Button>
                  Book for{" "}
                  {(
                    timeWindow *
                    (bookable.hourlyRate / 100)
                  ).toFixed(2)}
                  €
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      ) : null}
    </Box>
  );
}
