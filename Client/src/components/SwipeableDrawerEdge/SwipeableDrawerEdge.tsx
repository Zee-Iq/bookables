
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Button, Container } from "@mui/material";
import SwipeVerticalSharpIcon from "@mui/icons-material/SwipeVerticalSharp";
import SpacesList from "../SpacesList/SpacesList";
import { useEffect, useState } from "react";

const drawerBleeding = 80;

interface Props {
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
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
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const map = document.getElementById("map")
    console.log(map)
    map?.addEventListener("resize", () => {console.log("change");
    })
  },[])

  return (
    <Root sx={{ display: { xs: "block", md: "block" } }}>
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
        <Box
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            backgroundColor: grey[400],
            right: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            pointerEvents: "all",
            height: `calc(100% + ${drawerBleeding}px)`
          }}
        >
          <Puller />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography color={"primary"}>Available spaces</Typography>
              <SwipeVerticalSharpIcon color="primary" fontSize="small" />
            </Box>
          </Box>

          <Container
            onClick={(event) => event.stopPropagation()}
            sx={{ p: 2, color: "text.secondary", flexGrow: 1, height: "100%",  }}
          >
            <SpacesList sx={{ overflow: "auto", height: "100%" }} />
          </Container>
        </Box>
      </SwipeableDrawer>
    </Root>
  );
}
