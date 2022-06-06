import { Box } from "@mui/material";
import Map from "../Map/Map";
import AccordeonMobile from "../Mobile/AccordeonMobile";
import MobileDrawer from "../Mobile/MobileDrawer";
import Search from "../Search/Search";
const Home = () => {
  return (
    <Box>
    <AccordeonMobile />
    <MobileDrawer />
    <Search />
    <Map />
    </Box>
  );
};

export default Home;
