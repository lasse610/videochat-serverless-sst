import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Card, Box, Button, Typography, IconButton } from "@mui/material";
import { Screenshot, Call } from "src/types";
//import { deleteScreenshots } from "src/features/api/screenshots/Screenshots";

interface SelectedCallsOverlayProps {
  setSelectedScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
  selectedScreenshots: Screenshot[];
  callID: string;
  setCall: React.Dispatch<React.SetStateAction<Call | undefined>>;
  call: Call | undefined;
}

export default function SelectedCallsOverlay({
  setSelectedScreenshots,
  selectedScreenshots,
  callID,
  call,
  setCall,
}: SelectedCallsOverlayProps) {
  async function handleDelete() {
    if (call) {
      try {
        // await deleteScreenshots(selectedScreenshots, call.id);
        call.screenshots = call.screenshots?.filter(
          (screenshot) => !selectedScreenshots.includes(screenshot)
        );
        setSelectedScreenshots([]);
        setCall(call);
      } catch (error) {}
    }
  }

  function clearSelectedImages() {
    setSelectedScreenshots([]);
  }

  function selectAll() {
    if (call) {
      setSelectedScreenshots(call.screenshots ?? []);
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "80%",
        height: "100px",
        backgroundColor: "white",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <IconButton onClick={clearSelectedImages}>
          <CloseIcon sx={{ color: "black" }} />
        </IconButton>
        <Typography>{selectedScreenshots.length} selected</Typography>
        <Button
          onClick={selectAll}
          sx={{
            borderStyle: "solid",
            borderRadius: "50px",
            borderWidth: "3px",
            borderColor: "black",
            textTransform: "none",
            color: "black",
            paddingX: "20px",
          }}
        >
          Select All
        </Button>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Button
          onClick={handleDelete}
          sx={{
            borderStyle: "solid",
            borderRadius: "50px",
            borderWidth: "3px",
            borderColor: "black",
            textTransform: "none",
            color: "black",
            paddingX: "20px",
          }}
        >
          Delete
        </Button>
        <Button
          sx={{
            borderStyle: "solid",
            borderRadius: "50px",
            borderWidth: "3px",
            borderColor: "black",
            textTransform: "none",
            color: "black",
            paddingX: "20px",
          }}
        >
          Download
        </Button>
      </Box>
    </Card>
  );
}
