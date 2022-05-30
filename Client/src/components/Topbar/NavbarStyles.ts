import { SxProps, Theme } from "@mui/material"

const navbarStyles: SxProps<Theme> = {
    ".toolbar": {
        display: "flex",
        justifyContent: "space-between",
        
    },
    ".navItems": {
        display: "flex",
        gap: 1,
    },

    ".logo": {
        display: { xs: "none", md: "block" },
        color: "text.main",
        cursor: "pointer",

    },

    "avatar": {
        cursor: "pointer"
    },
 



}


export default navbarStyles