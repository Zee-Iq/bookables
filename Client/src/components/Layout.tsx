import { Container } from "@mui/material";
import {  Outlet } from "react-router-dom";
import Navbar from "./Topbar/Navbar";

const Layout = () => {
  return (
    <Container>
      <Navbar />
      <Outlet />
    </Container>
  );
};
export default Layout;
