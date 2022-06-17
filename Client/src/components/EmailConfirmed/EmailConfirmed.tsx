import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EmailConfirmed() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const history = useNavigate();



  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`/users/emailConfirmation/${token}`);

        if (response.data.success) {
          setMessage(
            "Your email has been verified! In few seconds you will be redirected to the home page"
          );

          setTimeout(() => history("/"), 5000);
        } else {
          setMessage(
            "Your email could not be verified, please contact the system administrators"
          );
        }
      } catch (error: any) {
        console.error(error.message);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <p>Please wait a while until we verify your email</p>
      <p>{message}</p>
    </div>
  );
}
