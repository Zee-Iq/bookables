import React from "react";
import { Avatar, Tooltip, Menu, MenuItem } from "@mui/material";

const NavigationMenu = () => {
  const [anchorEL, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEL);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar
        onClick={handleClick}
        alt="Profile Avatar"
        sx={{
          cursor: "pointer",
          backgroundColor: "lightgray",
          "&:hover": {
            backgroundColor: "crimson",
            /* test */
          },
        }}
      >
        {/* MENU */}
      </Avatar>
      <Menu
        open={open}
        anchorEl={anchorEL}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
      >
        <MenuItem> Profile</MenuItem>
        <MenuItem> Your Spaces</MenuItem>
        <MenuItem> Bookings</MenuItem>
      </Menu>

    </>
  );
};

export default NavigationMenu;
