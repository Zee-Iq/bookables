import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectUser, getUpdate } from "../../slices/userSlice";

import axios from "axios";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function ConfirmEmailModal() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(getUpdate());
  }, [dispatch]);

  useEffect(() => {
    if (user && !user?.email.isConfirmed) setOpen(true);
  }, [user]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please confirm your email address
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            We have sent a verification message to your e-mail address.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
