import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar/Topbar";

const Layout = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <Topbar />
      <Box sx={{flexGrow: 1}}>
        <Outlet />
      </Box>
    </Container>
  );
};
export default Layout;
