import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getUpdate, selectUser } from "../../slices/userSlice";
import { useLocation, Navigate } from "react-router-dom";
import PayoutInformation from "../PayoutInformation/PayoutInformation";

export default function RegisterSpace() {
  const location = useLocation();
  const loggedInUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUpdate());
  }, [dispatch]);

  const handleUserInformation = () => {
    if (!loggedInUser) {
      return <Navigate to="/login" state={{ from: location }} />;
    } else if (!loggedInUser.roles.includes("host")) {
      return <PayoutInformation />;
    } else {
      return <Navigate to="/yourspaces" />;
    }
  };

  return handleUserInformation();
}
