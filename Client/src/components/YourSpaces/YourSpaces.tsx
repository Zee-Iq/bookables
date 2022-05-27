import { AppBar, Box, Drawer, List, ListItem, ListItemButton, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SpaceEditor from "../SpaceEditor/SpaceEditor";

const YourSpaces = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <List>
        <ListItem>Space</ListItem>
      </List>
      <SpaceEditor/>
    </Box>
  );
};

export default YourSpaces;