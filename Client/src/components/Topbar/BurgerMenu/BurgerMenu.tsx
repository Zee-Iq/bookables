import React from "react";
import { Avatar, Tooltip, Menu, MenuItem, Button } from "@mui/material";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';



const BurgerMenu = () => {
  const [anchorEL, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEL);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

    return (
    <>
      <Button>
        <MenuOutlinedIcon className="burgerMenu"  />
      </Button>
      
            <Menu 
            open={open}
            anchorEl={anchorEL}
            onClose={() => setAnchorEl(null)}
            onClick={() => setAnchorEl(null)}
            > 
             <MenuItem> Register co-working space</MenuItem>
              <MenuItem> Register</MenuItem>
              <MenuItem> sign in</MenuItem>
            </Menu>
          
      
    </>
  );
};

export default BurgerMenu;
