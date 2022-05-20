import styled from "@emotion/styled";
import {
  AppBar,
  Button,
  InputBase,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import style from "./TopbarStyles";

const Topbar = () => {
  return (
    <Box sx={style}>
      <AppBar position="sticky" sx={{ backgroundColor: "primary.main" }}>
        <Toolbar className="toolbar">
          <Box>
            <Typography
              color="text.main"
              title="Home"
              sx={{ cursor: "pointer", display: { xs: "none", sm: "block" } }}
              variant="h6"
            >
              BOOKABLES
            </Typography>
          </Box>

          <Box  className="toolbarButtons">
            <Button  variant="contained">Register Co-working Space</Button>
            <Button color="primary" variant="contained">
              Login
            </Button>
            <Button variant="contained">Register</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;
