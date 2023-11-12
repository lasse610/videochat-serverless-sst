import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import {
  postScreenshotData,
  updateScreenshotNotes,
} from "src/features/api/screenshots/Screenshots";
import { Screenshot as ScreenshotType } from "src/types";

interface ScreenshotProps {
  screenshot: ScreenshotType;
}

export default function Screenshot(props: ScreenshotProps) {
  const { id, url } = props.screenshot;
  const [notes, setNotes] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNotes(e.target.value);
  }

  // fires when textfield is unfocused
  async function handleBlur() {
    await updateScreenshotNotes(id, notes);
  }

  return (
    <Box
      sx={{
        width: "90%",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          alt={"screenshot"}
          src={url}
          style={{ objectFit: "cover", width: "90%", height: "250px" }}
        ></img>
      </Box>
      <TextField
        onBlur={handleBlur}
        value={notes}
        onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
        label="Add Notes"
        rows={3}
      ></TextField>
    </Box>
  );
}
