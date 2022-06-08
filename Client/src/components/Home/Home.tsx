import { Box } from "@mui/material";
import Map from "../Map/Map";
import MobileDrawer from "../Mobile/MobileDrawer";
import Search from "../Search/Search";
const Home = () => {
  return (
    <Box>
    <MobileDrawer />
    <Search />
    <Map />
    </Box>
  );
};

export default Home;
