import {
  AppBar,
  Button,
  InputBase,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import style from "./TopbarStyles";

const Navbar = () => {
  return (
    <Box sx={style}>
      <AppBar
        className="navbar"
        position="sticky"
        sx={{ backgroundColor: "primary.main" }}
      >
        <Toolbar className="toolbar">
          <Box className="navContainer">
            <Typography className="logo" title="Home" variant="h6">
              BOOKABLES
            </Typography>
          </Box>

          <Box className="navItems">
            <Button title="" color="secondary" variant="contained">
              Register Co-working Space
            </Button>
            <Button color="secondary" variant="contained">
              Register
            </Button>
            <Button color="secondary" variant="contained">
              Sign in
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
