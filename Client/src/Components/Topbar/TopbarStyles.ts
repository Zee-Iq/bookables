import { SxProps, Theme } from "@mui/material"

const style: SxProps<Theme> = {
    ".toolbar": {
        display: "flex",
        justifyContent: "space-between",
    },
    ".toolbarButtons": {
        display: "flex",
        gap: 2,
    },
    "toolbarButtonsWrapper":{
        border: "10px solid red",
    }
}
export default style