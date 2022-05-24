import {
  AppBar,
  Button,
  InputBase,
  Toolbar,
  Typography,
  Box,
  Container,
} from "@mui/material";
import navbarStyles from "./NavbarStyles";

const Navbar = () => {
  return (
    <>
      <AppBar
        className="navbar"
        position="fixed"
        sx={{ ...navbarStyles, backgroundColor: "primary.main" }}
      >
        
        <Container  >
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
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;
