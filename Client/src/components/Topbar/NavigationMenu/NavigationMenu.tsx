import { Avatar, Tooltip, Menu, MenuItem } from "@mui/material";

import React from "react";



const NavigationMenu = () => {
  const [anchorEL, setAnchorEL] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEL);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEL(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEL(null);
  }

    return (
    <>
     {/*  <Tooltip
        arrow
        title={<h3 style={{ color: "lightblue" }}>Open Navigation Menu</h3>}
      > */}
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
            onClose={() => setAnchorEL(null)}
            onClick={() => setAnchorEL(null)}
            > 
              <MenuItem> Profile</MenuItem>
              <MenuItem> Your Spaces</MenuItem>
              <MenuItem> Bookings</MenuItem>
            </Menu>
          
      {/* </Tooltip> */}
    </>
  );
};

export default NavigationMenu;
