import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout";
import AppStyles from "./AppStyles";

import YourSpaces from "./components/YourSpaces/YourSpaces";
import SingleSpaces from "./components/SingleSpaces/SingleSpaces";

const App = () => {
  return (
    <Box sx={AppStyles}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="singlespaces" element={<SingleSpaces />} />
          <Route path="yourspaces" element={<YourSpaces />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
