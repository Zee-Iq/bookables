import { Box, List, ListItemButton, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Bookables from "types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchSpacesForHost, seletOwnedSpaces } from "../../slices/spacesSlice";
import AddIcon from "@mui/icons-material/Add";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectUser } from "../../slices/userSlice";
import { width } from "@mui/system";

const YourSpaces = () => {
  const dispatch = useAppDispatch();
  const spaces = useAppSelector(seletOwnedSpaces);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    dispatch(fetchSpacesForHost());
  }, [dispatch]);

  if (!user) return <Navigate to="/login" state={{ from: location }} />;
  if (user && !user.roles.includes("host"))
    return <Navigate to="/registerSpace" />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {xs: "column", md: "row"},
        gap: 1,
        pb: 1,
        pt: 1,
        height: "100%"
      }}
    >
      <Paper sx={{ p: 2 }}>
        <TextField
          label="Filter"
          type="text"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          autoComplete="off"
        />
        <List>
          <ListItemButton onClick={() => navigate(`./`)}>
            <AddIcon /> new Space
          </ListItemButton>
          {spaces
            .filter((space) =>
              space.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((space) => (
              <ListItemButton
                key={space.name}
                onClick={() => navigate(`./${space._id}`)}
              >
                {space.name}
              </ListItemButton>
            ))}
        </List>
      </Paper>
      <Paper sx={{ padding: 2, overflow: "hidden" }}>
        <Outlet />
      </Paper>
    </Box>
  );
};

export default YourSpaces;
