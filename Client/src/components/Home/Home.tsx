import { Box } from "@mui/material";
import ConfirmEmailModal from "../confirmEmailModal/CofirmEmailModal";
import Map from "../Map/Map";
import Search from "../Search/Search";


const Home = () => {
  return (
    <Box>
      <ConfirmEmailModal />
    <Search />
    <Map />
    </Box>
  );
};

export default Home;
