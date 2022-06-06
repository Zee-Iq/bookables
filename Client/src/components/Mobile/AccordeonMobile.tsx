import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchMobile from "./SearchMobile";

const AccordeonMobile = () => {
  return (
    <>
      <Accordion
        sx={{
          display: { xs: "block", md: "none" },
          mt: 1,
          color: "GrayText",
          backgroundColor: "gainsboro",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Search</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SearchMobile />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordeonMobile;
