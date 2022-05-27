import "./App.css";
import Register from "./components/register/Register";
import Login from "./components/login/Login"
import { Route, Routes } from "react-router-dom";
import EmailConfirmed from "./components/emailConfirmed/EmailConfirmed";
import Map from "./components/map/Map";
import Search from "./components/search/Search";



function App() {
  return (
    <div className="App">
      <div>test</div>
      <Register />
      <Login />

      <Routes>
        <Route path="/emailConfirmation/:token" element={<EmailConfirmed />} />
      </Routes>
      <Search/>
      <Map/>
    </div>
  );
}

export default App;
