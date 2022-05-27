import { Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header/Header";
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
