import { Box, Button, Stack, Typography } from "@mui/material";
import headerStyles from "./HeaderStyles";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import ApartmentTwoToneIcon from "@mui/icons-material/ApartmentTwoTone";
import MeetingRoomTwoToneIcon from "@mui/icons-material/MeetingRoomTwoTone";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <Box sx={headerStyles}>
      <Stack justifyContent="center" m={3} spacing={1} direction="row">
        <Box>
          <Link to="/" style={{textDecoration:"none"}}>
            <Button variant="outlined" size="large">
              <HomeTwoToneIcon />
              Home
            </Button>
          </Link>
        </Box>
        <Box className="headerlistItem">
          <Link to="/singlespaces" style={{textDecoration:"none"}} >
            <Button variant="outlined" size="large">
              <ApartmentTwoToneIcon />
              Single Spaces
            </Button>
          </Link>
        </Box>
        <Box className="headerlistItem">
          <Link to="/yourspace" style={{textDecoration:"none"}}>
            <Button variant="outlined" size="large">
              <MeetingRoomTwoToneIcon />
              Your Space
            </Button>
          </Link>
        </Box>
      </Stack>
      <Box></Box>
    </Box>
  );
};

export default Header;
