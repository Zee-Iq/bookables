import {
  AppBar,
  Button,
  InputBase,
  Toolbar,
  Typography,
  Box,
  Container,
} from "@mui/material";
import BurgerMenu from "./BurgerMenu/BurgerMenu";
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
        {/* DESKTOP VIEW */}
        <Container>
          <Toolbar className="toolbar">
            <Box className="navContainer">
              {/* LOGO */}
              <Typography className="logo" title="Home" variant="h6">
                BOOKABLES
              </Typography>
            </Box>

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

              {/* NavigationMenu component reference  */}
              <Box className="logo">
                <NavigationMenu />
              </Box>
            </Box>
          </Toolbar>
          
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
