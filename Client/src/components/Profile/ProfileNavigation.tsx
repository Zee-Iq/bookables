import * as React from "react";
import {
  IconButton,
  Drawer,
  styled,
  useTheme,
  Box,
  List,
  Button,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";

const drawerWidth = 260;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "center",
}));

export default function ProfileNavigation() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  

 
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <Typography>Close</Typography>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List onClick={handleDrawerClose}>
          <ListItem>
            <ListItemButton>
              <Link
                style={{ textDecoration: "none", color: "unset" }}
                to="/profile"
              >
                Account Details
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <Link
                style={{ textDecoration: "none", color: "unset" }}
                to="./paymentdetails"
              >
                Payment Details
              </Link>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <Link
                style={{ textDecoration: "none", color: "unset" }}
                to="./payoutdetails"
              >
                Payout Details
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleDrawerOpen}
        >
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Box>
              <ManageAccountsOutlinedIcon />
            </Box>
            <Box>Open Settings</Box>
          </Box>
        </Button>

        <DrawerHeader>
          <Outlet />
        </DrawerHeader>
      </Main>
    </Box>
  );
}
