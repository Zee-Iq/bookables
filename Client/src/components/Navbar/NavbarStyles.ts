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
        color:"text.main",
        cursor: "pointer",
        display: { xs: "none", sm: "block" },
        
    }

}
 

export default navbarStyles