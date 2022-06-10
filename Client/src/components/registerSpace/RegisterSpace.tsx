import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../../slices/userSlice";
import { Navigate } from "react-router-dom";
import YourSpaces from "../YourSpaces/YourSpaces";
import Login from "../login/Login";
import axios from "axios"

export default function RegisterSpace() {
  const user = useAppSelector(selectUser);

const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    const getUpdatedUser = async () => {
      const response = await axios.post("/users/updatedUser", {
        _id: user?._id,
      });

      setLoggedInUser(response.data.user)
    

      
    };
    getUpdatedUser();
  }, []);

  console.log("logged user is",loggedInUser);
  

  return ( 
    <h1>hello</h1>
  );
}
