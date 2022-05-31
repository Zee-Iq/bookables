import React from "react";
import { AppBar, Container, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MenuIcon from '@mui/icons-material/Menu';


const Topbar = () => {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            BOOKABLES
          </Typography>

            <Box sx={{flexGrow:1, display: {xs:"flex", md:"none"}}} >
                <IconButton
                color="inherit" 
                size="large"
                
                >
                    <MenuIcon  />
                </IconButton>

            </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Topbar;
