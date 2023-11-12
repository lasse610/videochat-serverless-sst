import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Screenshot } from "src/types";
import Image from "../Image/Image";

interface MediaGalleryProps {
  screenshots: Screenshot[];
  setSelectedScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
  selectedScreenshots: Screenshot[];
}

export default function MediaGallery({
  selectedScreenshots,
  screenshots,
  setSelectedScreenshots,
}: MediaGalleryProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontWeight: "bold" }}>Media Gallery</Typography>
      <Grid container spacing={1} justifyContent="center">
        {screenshots.map((screenshot, i) => (
          <Image
            index={i}
            selectedScreenshots={selectedScreenshots}
            screenshot={screenshot}
            setSelectedScreenshots={setSelectedScreenshots}
            key={screenshot.id}
          />
        ))}
      </Grid>
    </Box>
  );
}
