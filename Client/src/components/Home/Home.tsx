import { Box } from "@mui/material";
import ConfirmEmailModal from "../ConfirmEmailModal/CofirmEmailModal";
import Map from "../Map/Map";
import SwipeableDrawerEdge from "../SwipeableDrawerEdge/SwipeableDrawerEdge";
import Search from "../Search/Search";


const Home = () => {
  return (
    <Box>
      <ConfirmEmailModal />
    <SwipeableDrawerEdge />
    <Search />
    <Map />
    </Box>
  );
};

export default Home;
