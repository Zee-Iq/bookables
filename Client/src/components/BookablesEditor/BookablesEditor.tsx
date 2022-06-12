import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridToolbarProps,
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarFilterButton,
  useGridApiContext
} from "@mui/x-data-grid";
import { Box, BoxProps, FormGroupProps, IconButton } from "@mui/material";
import Bookables from "types";
import { useAppDispatch } from "../../hooks";
import {
  addBookable,
  deleteBookable,
  updateBookable,
} from "../../slices/spacesSlice";
import { useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LabeledFormGroup from "../LabeledFormGroup/LabeledFormGroup";

interface BookablesEditorProps {
  bookables: (Bookables.Bookable & { new?: true })[];
  spaceId: string;
}

const initialBookable = {
  _id: "new",
  name: "",
  type: "",
  hourlyRate: "",
};

const columns: GridColDef[] = [
  {
    field: "_id",
    headerName: "",
    renderCell(params) {
      console.log(params);
      return <div></div>;
    },
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    editable: true,
  },
  {
    field: "type",
    headerName: "Type",
    type: "singleSelect",
    editable: true,
    width: 100,
    valueOptions: ["room", "seat"],
  },
  {
    field: "hourlyRate",
    headerName: "Hourly Rate €",
    type: "number",
    width: 120,
    editable: true,
    valueGetter(params) {
      params.value = params.value / 100;
      return params.value;
    },
    valueSetter(params) {
      params.row.hourlyRate = params.value ? params.value * 100 : params.value;
      return params.row;
    },
  },
];

export default function BookablesEditor({
  bookables,
  spaceId,
  ...props
}: BookablesEditorProps & FormGroupProps) {
  const dispatch = useAppDispatch();
  const columns: GridColDef[] = useMemo(
    () =>
      [
        {
          field: "action",
          headerName: "",
          renderCell(params) {
            if (params.id === "new")
              return (
                <IconButton
                  sx={{ width: "100%", height: "100%" }}
                  onClick={() =>
                    dispatch(
                      addBookable({
                        name: params.row.name,
                        type: params.row.type,
                        hourlyRate: params.row.hourlyRate,
                        spaceId: spaceId as any,
                      })
                    )
                  }
                >
                  <AddIcon />
                </IconButton>
              );
            else
              return (
                <IconButton
                  sx={{ width: "100%", height: "100%" }}
                  onClick={() => dispatch(deleteBookable(params.row))}
                >
                  <DeleteForeverIcon />
                </IconButton>
              );
          },
          width: 70,
        },
        {
          field: "name",
          headerName: "Name",
          width: 200,
          editable: true,
        },
        {
          field: "type",
          headerName: "Type",
          type: "singleSelect",
          editable: true,
          width: 100,
          valueOptions: ["room", "seat"],
        },
        {
          field: "hourlyRate",
          headerName: "Hourly Rate €",
          type: "number",
          width: 120,
          editable: true,
          valueGetter(params) {
            params.value = params.value / 100;
            return params.value;
          },
          valueSetter(params) {
            params.row.hourlyRate = params.value
              ? params.value * 100
              : params.value;
            return params.row;
          },
        },
      ] as GridColDef[],
    [spaceId]
  );
  return (
    <LabeledFormGroup {...props} label="Bookables" style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={[initialBookable as unknown as Bookables.Bookable].concat(
          bookables.reduceRight((reversed, bookable)=> [...reversed, bookable],[] as Bookables.Bookable[])
        )}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        editMode="row"
        components={{ Toolbar }}
        disableDensitySelector
        disableColumnSelector
        getRowId={(row) => row._id}
        onRowEditStop={(params, b, c) => {
          if (
            params.row.name &&
            (params.row.type === "room" || params.row.type === "seat") &&
            params.row.hourlyRate
          ) {
            if (params.id !== "new") dispatch(updateBookable(params.row));
          }
        }}
        isRowSelectable={(row) => row.id !== "new"}
      />
    </LabeledFormGroup>
  );
}

function Toolbar(props: GridToolbarContainerProps) {
  return (
    <GridToolbarContainer {...props}>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}
