import React, { PropsWithChildren } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";

import { version as appVersion } from "../../../package.json";
import Video from "twilio-video";
import { useAppState } from "../../context/state";

interface AboutDialogProps {
  open: boolean;
  onClose(): void;
}

function AboutDialog({ open, onClose }: PropsWithChildren<AboutDialogProps>) {
  const { roomType } = useAppState();
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle>About</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          Browser supported: {String(Video.isSupported)}
        </DialogContentText>
        <DialogContentText>SDK Version: {Video.version}</DialogContentText>
        <DialogContentText>App Version: {appVersion}</DialogContentText>
        <DialogContentText>
          Deployed Tag: {process.env.REACT_APP_GIT_TAG || "N/A"}
        </DialogContentText>
        <DialogContentText>
          Deployed Commit Hash: {process.env.REACT_APP_GIT_COMMIT || "N/A"}
        </DialogContentText>
        {roomType && (
          <DialogContentText>Room Type: {roomType}</DialogContentText>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AboutDialog;
