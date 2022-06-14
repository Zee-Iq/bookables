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
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { Link, Outlet } from "react-router-dom";

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

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
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
      <AppBar position="fixed" open={open}></AppBar>
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
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          <ListItem>
            <ListItemButton>
              <Link
                style={{ textDecoration: "none", color: "unset" }}
                to="/accountdetails"
              >
                Account Details
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem>
            <ListItemButton>
              <Link
                style={{ textDecoration: "none", color: "unset" }}
                to="/paymentdetails"
              >
                Payment Details
              </Link>
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem>
            <ListItemButton>
              <Link
                style={{ textDecoration: "none", color: "unset" }}
                to="/payoutdetails"
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
          color="secondary"
          onClick={handleDrawerOpen}
          sx={{ mr: 2 }}
        >
          <ManageAccountsOutlinedIcon />
        </Button>
        <Typography variant="h6" component="h1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo odio fugit sapiente inventore iste odit nemo sunt delectus quidem? Nulla distinctio maiores, laboriosam est odit vero officia animi consequatur delectus earum, magni culpa architecto sed consectetur obcaecati impedit. Numquam dignissimos omnis expedita ducimus, beatae inventore! Dolor saepe nobis suscipit molestias?</Typography>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
