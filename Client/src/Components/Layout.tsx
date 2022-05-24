import { Link, Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Navbar from "./Topbar/Navbar";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Header />
    </div>
  );
};
export default Layout;
