import Register from "./components/Register/Register";
import Login from "./components/login/Login";
import EmailConfirmed from "./components/emailConfirmed/EmailConfirmed";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout";
import AppStyles from "./AppStyles";
import YourSpaces from "./components/YourSpaces/YourSpaces";
import SingleSpace from "./components/SingleSpace/SingleSpace";
import RegisterSpace from "./components/registerSpace/RegisterSpace";
import SpaceEditor from "./components/SpaceEditor/SpaceEditor";

const App = () => {
  return (
    <Box sx={AppStyles}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="singlespace" element={<SingleSpace />} />
          <Route path="yourspaces" element={<YourSpaces />}>
            <Route index element={<SpaceEditor />} />
            <Route path=":spaceId" element={<SpaceEditor />} />
          </Route>
          <Route
            path="/emailConfirmation/:token"
            element={<EmailConfirmed />}
          />
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />
          <Route path="/registerSpace" element={<RegisterSpace />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
