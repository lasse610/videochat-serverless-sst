import { Box } from "@mui/material";
import React from "react";
import Screenshot from "../Screenshot/Screenshot";
import { Screenshot as IScreenshot } from "src/types";

interface ScreenshotsProps {
  screenshots: IScreenshot[];
  screenshotNotes: string[];
  setScreenshotNotes: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Screenshots(props: ScreenshotsProps) {
  const { screenshots } = props;
  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
        flexDirection: "column-reverse",
        width: "100%",
        overflowY: "scroll",
        maxHeight: "100%",
      }}
    >
      {screenshots.map((shot, i) => (
        <Screenshot key={shot.id} screenshot={shot} />
      ))}
    </Box>
  );
}
