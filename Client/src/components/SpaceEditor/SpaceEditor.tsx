import { AppBar, Box, Drawer, List, ListItem, ListItemButton, Toolbar, Typography, BoxProps } from "@mui/material";
import { Link } from "react-router-dom";

const SpaceEditor = (props: BoxProps) => {
  return (
    <Box {...props} sx={{ display: 'flex' }}>
        Editor here      
    </Box>
  );
};

export default SpaceEditor;
