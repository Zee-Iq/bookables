import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import EmailConfirmed from "./components/EmailConfirmed/EmailConfirmed";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout";
import AppStyles from "./AppStyles";
import YourSpaces from "./components/YourSpaces/YourSpaces";
import SingleSpace from "./components/SingleSpace/SingleSpace";
import RegisterSpace from "./components/RegisterSpace/RegisterSpace";
import SpaceEditor from "./components/SpaceEditor/SpaceEditor";
import ProfileLayout from "./components/Profile/ProfileLayout";
import AccountDetails from "./components/Profile/AccountDetails";
import PaymentDetails from "./components/Profile/PaymentDetails";
import PayoutInformation from "./components/PayoutInformation/PayoutInformation";
import ConfirmEmailModal from "./components/ConfirmEmailModal/CofirmEmailModal";
import YourBookings from "./components/YourBookings/YourBookings";
import PaymentProvider from "./components/PaymentProvider/PaymentProvider";

const App = () => {
  return (
    <Box sx={AppStyles}>
      
      <ConfirmEmailModal />
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
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<AccountDetails />} />
            <Route path="paymentdetails" element={<PaymentDetails />} />
            <Route path="payoutdetails" element={<PayoutInformation />} />
          </Route>

          <Route path="/registerSpace" element={<RegisterSpace />} />
          <Route path="/payoutInformation" element={<PayoutInformation />} />
          <Route path="/paymentProvider" element={<PaymentProvider />} />
          <Route path="/yourBookings" element={<YourBookings />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
