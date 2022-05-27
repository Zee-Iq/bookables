import { Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Navbar from "./Topbar/Navbar";

const Layout = () => {
  return (
    <Container
      sx={{ display: "grid", gridTemplateRows: "max-content 1fr", gap: 1, minHeight: "100vh" }}
    >
      <Navbar />
      <Outlet />
    </Container>
  );
};
export default Layout;
