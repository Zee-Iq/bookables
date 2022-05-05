import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout";

import YourSpaces from "./Components/YourSpaces/YourSpaces";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="yourspace" element={<YourSpaces />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
