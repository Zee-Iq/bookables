import {
  List,
  ListProps,
  ListItem,
  Accordion,
  Typography,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Box,
} from "@mui/material";
import { useAppSelector } from "../../hooks";
import { selectSpacesInArea } from "../../slices/spacesSlice";
import BookablesList from "../BookablesList/BookablesList";

export default function SpacesList(props: ListProps) {
  const spaces = useAppSelector(selectSpacesInArea);

  return spaces.length !== 0 ? (
    <List {...props}>
      {[...spaces]
        .sort((a, b) => b.bookables.length - a.bookables.length)
        .map((space) => (
          <ListItem key={space._id as unknown as string} sx={{ width: "100%" }}>
            <Accordion
              defaultExpanded={space.bookables.length > 0}
              sx={{ width: "100%" }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                style={{display: "block"}}
                
              >
                <Box sx={{width: "100%"}}>
                  <Box sx={{display: "flex", justifyContent:"space-between", width: "100%"}}>
                    <Typography variant="h5" fontWeight={700}>{space.name}</Typography>
                    <Typography>Bookables: {space.bookables.length}</Typography>
                  </Box>
                  <Box>
                  {space.address.formattedAddress}
                  </Box>
                </Box>
                
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                {space.bookables.length !== 0 ? (
                  <BookablesList bookables={space.bookables} />
                ) : (
                  <Typography>
                    This Co-Working Space does not have any available bookables
                    in your selected Timeframe.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </ListItem>
        ))}
    </List>
  ) : (
    <Typography>
      It seems like there are no Co-Working Spaces in your selected Area. Zoom
      out to find more.
    </Typography>
  );
}
