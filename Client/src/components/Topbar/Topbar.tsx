import React from "react";
import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logout, selectUser } from "../../slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

type Setting = "Profile" | "Bookings" | "Your spaces" | "Logout";

const hostAndUserSettings: Setting[] = [
  "Profile",
  "Bookings",
  "Your spaces",
  "Logout",
];
const hostSettings: Setting[] = ["Profile", "Your spaces", "Logout"];
const tenantSettings: Setting[] = ["Profile", "Bookings", "Logout"];
const noRolesSettings: Setting[] = ["Profile", "Logout"];

const Topbar = () => {
  const user = useAppSelector(selectUser);

  //const settings = user?.roles.includes("host")? ["Profile", "Bookings", "Logout"]?user.roles.includes("tenant")?["asdasdasd"] : []

  // ? is checking if user is null or undefined, if so returns null or undefined, if it is not either one, the program continues with &&.user.rolesroles etc
  const settings =
    user?.roles.includes("host") && user.roles.includes("tenant")
      ? hostAndUserSettings
      : user?.roles.includes("host")
      ? hostSettings
      : user?.roles.includes("tenant")
      ? tenantSettings
      : noRolesSettings;

  const pages = useMemo(
    () =>
      user
        ? ["Register your Co-working Space"]
        : ["Register your Co-working Space", "Login", "Register"],
    [user]
  );

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const dispatch = useAppDispatch();

  const handleSelectMenuItem = (setting: Setting) => {
    switch (setting) {
      case "Logout":
        dispatch(logout());
        break;
      case "Bookings":
        navigate("/bookings");
        break;
      case "Profile":
        navigate("/profile");
        break;
      case "Your spaces":
        navigate("/yourspaces");
        break;
      default:
        // const never checks if the switch case block contains a case for each possible setting
        const never: never = setting;
        throw never;
    }
    handleCloseUserMenu();
  };

  const handleSelectPage = (page: string) => {
    switch (page) {
      case pages[0]:
        navigate("/registerSpace");
        break;
      case pages[1]:
        navigate("/login");
        break;
      case pages[2]:
        navigate("/register");
        break;
    }
    handleCloseNavMenu();
  };

  return (
    <>
      <AppBar position="fixed">
        <Container>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link style={{ textDecoration: "none", color: "unset" }} to="/">
              <Typography
                variant="h5"
                component="div"
                sx={{
                  display: { xs: "none", md: "flex" },
                  textDecoration: "",
                  fontWeight: "500",
                }}
              >
                BOOKABLES
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                color="inherit"
                size="large"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* BURGER */}
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={() => {
                      handleSelectPage(page);
                    }}
                  >
                    <Typography textAlign="end">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Link
              style={{ textDecoration: "none", color: "unset", flexGrow: 1 }}
              to="/"
            >
              <Typography
                variant="h5"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },

                  fontWeight: "500",
                  color: "inherit",
                }}
              >
                BOOKABLES
              </Typography>
            </Link>

            {/* DESKTOP VIEW */}
            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    variant="text"
                    key={page}
                    onClick={() => {
                      handleSelectPage(page);
                    }}
                    sx={{ display: "block", color: "inherit" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              {/* AVATAR */}
              {user ? (
                <Box>
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar />
                  </IconButton>
                  {/* AVATAR MENU */}
                  <Menu
                    sx={{ mt: "45px" }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={() => handleSelectMenuItem(setting)}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <div></div>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Topbar;
