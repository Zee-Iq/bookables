import { Link, Outlet } from "react-router-dom";
import Topbar from "./Topbar/Topbar";

const Layout = () => {
  return (
    <div>
      <Topbar/>
      {/* <h1>Bookables</h1> */} {/* topbar here instead */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/single">Single Space Page</Link>
          </li>
          <li>
            <Link to="/yourspace">Your Spaces</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};
export default Layout;
