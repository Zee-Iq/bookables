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
import NavigationMenu from "./NavigationMenu/NavigationMenu";

const Navbar = () => {
  /* HOOKS */

  return (
    <>
      <AppBar
        className="navbar"
        position="fixed"
        sx={{ ...navbarStyles, backgroundColor: "primary.main" }}
      >
        <Container>
          <Toolbar className="toolbar">
            <Box className="navContainer">
              {/* LOGO */}
              <Typography className="logo" title="Home" variant="h6">
                BOOKABLES
              </Typography>
            </Box>

            {/* BUTTONS */}
            <Box className="navItems">
              <Button className="logo" color="secondary" variant="contained">
                Register Co-working Space
              </Button>
              <Button className="logo" color="secondary" variant="contained">
                Register
              </Button>
              <Button className="logo" color="secondary" variant="contained">
                Sign in
              </Button>

              {/* MENU COMPONENT REFERENCE HERE */}
              <NavigationMenu />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;
