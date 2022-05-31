import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar/Topbar";

const Layout = () => {
  return (
    <Container>
      <Topbar />
      <Outlet />
    </Container>
  );
};
export default Layout;
