import { Box, Paper } from "@mui/material";
import Bookables from "types";

interface SpaceEditorProps {
    space?: Bookables.Space,
    isNew?: boolean
}

const SpaceEditor = ({space, isNew}: SpaceEditorProps) => {
  return (
    <Paper sx={{ display: 'flex', padding: 2 }}>
        Editor here      
    </Paper>
  );
};

export default SpaceEditor;
