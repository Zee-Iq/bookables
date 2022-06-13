import { Box } from "@mui/material";
import ConfirmEmailModal from "../ConfirmEmailModal/CofirmEmailModal";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { fetchSpacesInArea } from "../../slices/spacesSlice";
import Map from "../Map/Map";
import SwipeableDrawerEdge from "../SwipeableDrawerEdge/SwipeableDrawerEdge";
import Search from "../Search/Search";


const Home = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchSpacesInArea({} as any))
  }, [dispatch])
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
