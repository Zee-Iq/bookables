import { Box, Divider, List, ListItemButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import Bookables from "types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchSpacesForHost, seletOwnedSpaces } from "../../slices/spacesSlice";
import SpaceEditor from "../SpaceEditor/SpaceEditor";
import AddIcon from "@mui/icons-material/Add";

const YourSpaces = () => {
  const [selectedSpace, setSelectedSpace] = useState<Bookables.Space>();
  const dispatch = useAppDispatch();
  const spaces = useAppSelector(seletOwnedSpaces);

  useEffect(() => {
    if (spaces.length > 0) setSelectedSpace(spaces[0]);
  }, [spaces]);

  useEffect(() => {
    dispatch(fetchSpacesForHost());
  }, [dispatch]);
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: 1, minHeight: "100%", pb:1 }}>
      <Paper>
        <List>
          {spaces.map((space) => (
            <ListItemButton
              key={space.name}
              onClick={() => setSelectedSpace(space)}
            >
              {space.name}
            </ListItemButton>
          ))}
          <ListItemButton onClick={() => setSelectedSpace(undefined)}>
            <AddIcon /> new Space
          </ListItemButton>
        </List>
      </Paper>
      <SpaceEditor space={selectedSpace} />
    </Box>
  );
};

export default YourSpaces;
