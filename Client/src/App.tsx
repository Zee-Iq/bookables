import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout";
import AppStyles from "./AppStyles";

import YourSpaces from "./Components/YourSpaces/YourSpaces";

const App = () => {
  return (
    <div>
      <Box sx={AppStyles}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="yourspace" element={<YourSpaces />} />
          </Route>
        </Routes>
      </Box>
    </div>
  );
};

export default App;
