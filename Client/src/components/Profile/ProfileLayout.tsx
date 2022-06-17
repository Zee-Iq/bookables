import { Container } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import ProfileNavigation from "./ProfileNavigation";

const ProfileLayout = () => {
  return (
    
      <Container>
        <ProfileNavigation />
        <Outlet />
      </Container>
    
  );
};

export default ProfileLayout;
