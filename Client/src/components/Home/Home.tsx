import { Box } from "@mui/material";
import Map from "../Map/Map";
import SwipeableDrawerEdge from "../SwipeableDrawerEdge/SwipeableDrawerEdge";
import Search from "../Search/Search";
const Home = () => {
  return (
    <Box>
    <SwipeableDrawerEdge />
    <Search />
    <Map />
    </Box>
  );
};

export default Home;
