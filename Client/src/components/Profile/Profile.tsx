import { Container } from "@mui/material";
import React from "react";
import ProfileNavigation from "./ProfileNavigation";

const Profile = () => {
  return (
    <>
      <Container sx={{ display: "flex", border:"10px solid red " }}>
        <ProfileNavigation />

      </Container>
    </>
  );
};

export default Profile;
