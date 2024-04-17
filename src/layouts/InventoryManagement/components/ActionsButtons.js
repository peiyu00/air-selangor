import React, { useState } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

function ActionsButtons({ meterDetails }) {
  const [open, setOpen] = useState(false);

  const handleView = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="secondary" size="small" onClick={handleView}>
        <VisibilityIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Meter Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Region: {meterDetails.location}</Typography>
          <Typography variant="body1">Serial Number: {meterDetails.serialNumber}</Typography>
          <Typography variant="body1">Meter Type: {meterDetails.meterType}</Typography>
          <Typography variant="body1">Installation Date: {meterDetails.installationDate}</Typography>
          {/* Add more details as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ActionsButtons;
