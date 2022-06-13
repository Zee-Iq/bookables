import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { selectToken } from "../../slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


export default function RegisterSpace() {
  const token = useAppSelector(selectToken);
  const navigate = useNavigate();
  const location = useLocation();

  const [loggedInUser, setLoggedInUser] = useState<any>(null) ;

  useEffect(() => {
    const getUpdatedUser = async () => {
      const response = await axios.post("/users/updatedUser", { token });

      setLoggedInUser(response.data.user);
    };
    getUpdatedUser();
  }, []);

  const handleUserInformation = () => {

     if (loggedInUser == null) {
      navigate("/login", {state: location.pathname });
    } 

    else if (loggedInUser.payoutInformation == null) {
      navigate("/payoutInformation", {state: location.pathname });
    }

    else {
      navigate("/yourspaces")
    }

  }

  handleUserInformation()

  return (
    <div></div>
    
  );
}
