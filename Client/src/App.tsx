import { Box, Button } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout";
import AppStyles from "./AppStyles";

import YourSpaces from "./components/YourSpaces/YourSpaces";
import SingleSpaces from "./components/SingleSpaces/SingleSpaces";
import Register from "./components/Register/Register";
import { useAppDispatch } from "./hooks";
import { login } from "./slices/userSlice";

const App = () => {
  const dispatch = useAppDispatch()
  return (
    
<>
<Register />
<Button onClick={() => dispatch(login({email:"test@test.de", password:"123"}))} > 
login
</Button>

</>

    
   /*  <Box sx={AppStyles}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="singlespaces" element={<SingleSpaces />} />
          <Route path="yourspace" element={<YourSpaces />} />
        </Route>
      </Routes>
    </Box> */
  );
};

export default App;
