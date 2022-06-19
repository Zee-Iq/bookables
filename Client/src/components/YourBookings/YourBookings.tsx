import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { selectUser } from "../../slices/userSlice";
import { useAppSelector } from "../../hooks";

export default function YourBookings() {
  const loggedInUser = useAppSelector(selectUser);
  const location = useLocation();

  if (!loggedInUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  } else if (!loggedInUser.roles.includes("tenant")) {
    return <Navigate to="/paymentProvider" state={{ from: location }} />;
  }

  return <div></div>;
}
