import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { selectToken } from "../../slices/userSlice";
import { Navigate } from "react-router-dom";
import YourSpaces from "../YourSpaces/YourSpaces";
import Login from "../login/Login";
import axios from "axios"

export default function RegisterSpace() {
  const token = useAppSelector(selectToken);

const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    const getUpdatedUser = async () => {
      const response = await axios.post("/users/updatedUser", 
        {token}
      );

      setLoggedInUser(response.data.user)
    
      console.log("response is", response);
      
      
    };
    getUpdatedUser();
  }, []); 

  console.log("token is", token);
  

  return ( 
    <h1>hello</h1>
  );
}
