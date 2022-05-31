import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Topbar from "./Navbar/Topbar/Topbar";

const Layout = () => {
  return (
    <Container>
      <Topbar />
      <Outlet />
    </Container>
  );
};
export default Layout;
