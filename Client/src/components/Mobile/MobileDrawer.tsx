import * as React from "react";
import { ClassNames, Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Search from "../Search/Search";
import { Button, List, ListItem } from "@mui/material";

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
  maxHeight: "350px",
  overflow: "auto",
}));

export default function MobileDrawer(props: Props) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  /* DUMMY RESULTS LOOP FROM 1 TO 40 TO BE MAPPED IN DRAWER */
  const results = Array.from(Array(40).keys()).map(i => `result ${i + 1}`);

  return (
    <Root sx={{ display: { xs: "block", md: "none" } }}>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(80% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <Box sx={{ textAlign: "center", pt: 2 }}>
        <Search />
        {/* DRAWER TOGGLE BUTTON */}
      {/*   <Button
          variant="outlined"
          sx={{ pt: 2, pb: 2 }}
          onClick={toggleDrawer(true)}
        >
          Show all available spaces
        </Button> */}
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

            {/* MAPPING DUMMY RESULTS*/}
            <ListContainer>
              {results.map((result) => {
                return <div>{result}</div>;
              })}
            </ListContainer>
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
        ></StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}
