import { List, ListProps, ListItem, Button, Box, Typography } from "@mui/material";
import Bookables from "types";
import moment from "moment";
import { useAppSelector } from "../../hooks";
import { selectFilters } from "../../slices/filterSlice";

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
  return (
    <Box>
        <Typography variant="h6">Seats</Typography>
        <List {...props}>
          {bookables.map((bookable) => (
            <ListItem key={bookable._id as unknown as string} sx={{justifyContent: "space-between"}}>
              {bookable.name}
              <Button>
                Book for{" "}
                {(
                  Math.abs(moment(fromDate).diff(moment(toDate), "hours")) *
                  (bookable.hourlyRate / 100)
                ).toFixed(2)}
                €
              </Button>
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Rooms</Typography>
        <List {...props}>
          {bookables.map((bookable) => (
            <ListItem key={bookable._id as unknown as string}  sx={{justifyContent: "space-between"}}>
              {bookable.name}
              <Button>
                Book for{" "}
                {(
                  Math.abs(moment(fromDate).diff(moment(toDate), "hours")) *
                  (bookable.hourlyRate / 100)
                ).toFixed(2)}
                €
              </Button>
            </ListItem>
          ))}
        </List>
    </Box>
  );
}
