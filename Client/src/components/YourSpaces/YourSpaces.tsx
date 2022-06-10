import { Box, List, ListItemButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import Bookables from "types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchSpacesForHost, seletOwnedSpaces } from "../../slices/spacesSlice";
import AddIcon from "@mui/icons-material/Add";
import { Outlet, useNavigate } from "react-router-dom";

const YourSpaces = () => {
  const dispatch = useAppDispatch();
  const spaces = useAppSelector(seletOwnedSpaces);
  const navigate = useNavigate()


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
              onClick={() => navigate(`./${space._id}`)}
            >
              {space.name}
            </ListItemButton>
          ))}
          <ListItemButton onClick={() => navigate(`./`)}>
            <AddIcon /> new Space
          </ListItemButton>
        </List>
      </Paper>
      <Outlet/>
    </Box>
  );
};

export default YourSpaces;
