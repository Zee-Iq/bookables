import "./App.css";
import Register from "./components/register/Register";
import { Route, Routes } from "react-router-dom";
import EmailConfirmed from "./components/emailConfirmed/EmailConfirmed";
import { JsxAttributeLike } from "typescript";


function App() {
  return (
    <div className="App">
      <div>test</div>
      <Register />

      <Routes>
        <Route path="/emailConfirmation/:token" element={<EmailConfirmed />} />
      </Routes>
    </div>
  );
}

export default App;
