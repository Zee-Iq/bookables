import Register from "./Components/Register/Register";
import Login from "./Components/login/Login";
import EmailConfirmed from "./Components/emailConfirmed/EmailConfirmed";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout";
import AppStyles from "./AppStyles";
import YourSpaces from "./Components/YourSpaces/YourSpaces";
import SingleSpaces from "./Components/SingleSpaces/SingleSpaces";


const App = () => {
  return (
    <Box sx={AppStyles}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="singlespaces" element={<SingleSpaces />} />
          <Route path="yourspace" element={<YourSpaces />} />
          <Route
            path="/emailConfirmation/:token"
            element={<EmailConfirmed />}
          />
          <Route path="/register" element={<Register />} />
        
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
