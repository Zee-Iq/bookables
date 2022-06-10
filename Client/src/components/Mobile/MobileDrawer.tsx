import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Button, Container } from "@mui/material";
import SwipeVerticalSharpIcon from "@mui/icons-material/SwipeVerticalSharp";
import DrawerList from "./DrawerList";

const drawerBleeding = 70;

interface Props {
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

const ListContainer = styled(Box)(() => ({
  marginTop: "20px",
  maxHeight: "550px",
  overflow: "auto",
}));

export default function MobileDrawer(props: Props) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  /* DUMMY RESULTS LOOP FROM 1 TO 40 TO BE MAPPED IN DRAWER */
  const results = Array.from(Array(40).keys()).map((i) => `result ${i + 1}`);

  return (
    <Root sx={{ display: { xs: "block", md: "block" } }}>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(80% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onClick={toggleDrawer(!open)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={true}
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
            display: { xs: "block", md: "block" },
            pointerEvents: "all",
          }}
        >
          <Puller />
          <Container>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Box>
                <Button>
                  <Button variant="text" color="info">
                    Available spaces
                  </Button>
                  <Box sx={{ flexGrow: 2 }}></Box>
                  <Box>
                    <SwipeVerticalSharpIcon
                      color="secondary"
                      fontSize="small"
                      sx={{ marginTop: "0.25rem" }}
                    />
                  </Box>
                </Button>
              </Box>
            </Box>
          </Container>
          <Typography
            onClick={(event) => event.stopPropagation()}
            sx={{ p: 2, color: "text.secondary" }}
          >
            {/* MAPPING DUMMY RESULTS*/}
            <Container>
              <ListContainer>
                <DrawerList />
              </ListContainer>
            </Container>
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "hidden",
          }}
        ></StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}
