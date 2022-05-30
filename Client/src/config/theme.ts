import { createTheme } from "@mui/material/styles";
import { letterSpacing } from "@mui/system";

const theme = createTheme({
    palette: {
        primary: {
            dark: "hsl(51, 0%, 20%)", //darker
            light: "hsl(51, 0%, 80%)", //lighter 
            main: "hsl(51, 0%, 50%)", //light grey as main

        },
        secondary: {
            main: "hsl(211, 75%, 55%)", //blue


        },
        text: {
            primary: "#393939", //black
        }
    }

})


export default theme