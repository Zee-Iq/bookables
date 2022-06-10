import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridToolbarProps,
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Box, BoxProps } from "@mui/material";
import Bookables from "types";

interface BookablesEditorProps {
  bookables: Bookables.Bookable[];
  spaceId: string;
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",

    editable: true,
  },
  {
    field: "type",

    editable: true,
    valueOptions: ["room", "seat"],
  },
  {
    field: "hourlyRate",
    headerName: "Hourly Rate",
    type: "number",

    editable: true,
  },
];

export default function BookablesEditor({
  bookables,
  spaceId,
  ...props
}: BookablesEditorProps & BoxProps) {
  return (
    <Box {...props} style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={bookables}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        editMode="row"
        components={{ Toolbar }}
        disableDensitySelector
        disableColumnSelector
        getRowId={(row) => row._id}
      />
    </Box>
  );
}

function Toolbar(props: GridToolbarContainerProps) {
  return (
    <GridToolbarContainer {...props}>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}
