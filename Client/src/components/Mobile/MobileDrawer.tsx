import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Search from "../Search/Search";
import { Button, List, ListItem } from "@mui/material";

const drawerBleeding = 150;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: grey[400],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function MobileDrawer(props: Props) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    
      <Root sx={{ display: { xs: "block", md: "none" } }}>
        <CssBaseline />
        <Global
          styles={{
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: "visible",
            },
          }}
        />
        <Box sx={{ textAlign: "center", pt: 2 }}>
          <Search />
          {/* DRAWER TOGGLE BUTTON */}
           <Button
            variant="outlined"
            sx={{ pt: 2, pb: 2 }}
            onClick={toggleDrawer(true)}
          >
            Show all available spaces
          </Button>
        </Box>
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              position: "absolute",
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
              display: { xs: "block", md: "none" },
            }}
          >
      
            <Puller onClick={toggleDrawer(true)}></Puller>
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              51 results
              <List>
                <ListItem>DISPLAY DATA HERE 1 </ListItem>
                <ListItem>DISPLAY DATA HERE 2 </ListItem>
                <ListItem>DISPLAY DATA HERE 3 </ListItem>
                <ListItem>DISPLAY DATA HERE 4 </ListItem>
                <ListItem>DISPLAY DATA HERE 5 </ListItem>
                <ListItem>DISPLAY DATA HERE 6 </ListItem>
                <ListItem>DISPLAY DATA HERE 7 </ListItem>
                <ListItem>DISPLAY DATA HERE 8 </ListItem>
                <ListItem>DISPLAY DATA HERE 9 </ListItem>
                <ListItem>DISPLAY DATA HERE 10 </ListItem>
                <ListItem>DISPLAY DATA HERE 11</ListItem>
                <ListItem>DISPLAY DATA HERE 12 </ListItem>
                <ListItem>DISPLAY DATA HERE 13 </ListItem>
                <ListItem>DISPLAY DATA HERE 14 </ListItem>
                <ListItem>DISPLAY DATA HERE 15 </ListItem>
                <ListItem>DISPLAY DATA HERE 16</ListItem>
                <ListItem>DISPLAY DATA HERE 17 </ListItem>
                <ListItem>DISPLAY DATA HERE 18 </ListItem>
                <ListItem>DISPLAY DATA HERE 19 </ListItem>
                <ListItem>DISPLAY DATA HERE 20 </ListItem>
              </List>
            </Typography>
          </StyledBox>
          <StyledBox
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",
            }}
          >
      
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    
  );
}
