import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Grid, Box } from "@mui/material";
import { Screenshot } from "src/types";
import { useNavigate, useParams } from "react-router-dom";

interface ImageProps {
  screenshot: Screenshot;
  selectedScreenshots: Screenshot[];
  setSelectedScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
  index: number;
}

export default function Image({
  selectedScreenshots,
  setSelectedScreenshots,
  screenshot,
  index,
}: ImageProps) {
  const { filename } = screenshot;
  const isClicked = selectedScreenshots.includes(screenshot);
  const navigate = useNavigate();
  const { callID } = useParams();

  function handleImageSelect(e: React.SyntheticEvent) {
    e.stopPropagation();
    if (!isClicked) {
      // Add current screenshot to selected screenshots on click
      setSelectedScreenshots((selected) => selected.concat(screenshot));
    } else {
      setSelectedScreenshots((selected) =>
        selected.filter((sShot) => sShot.id !== screenshot.id)
      );
    }
  }

  function handleMoveToImageView() {
    navigate(`/mycalls/${callID}/images?index=${index}`);
  }

  return (
    <Grid
      item
      sx={{
        overflow: "hidden",
        maxWidth: "45%",
      }}
    >
      <Box
        sx={{
          backgroundColor: isClicked ? "primary.main" : "",
          overflow: "hidden",
          position: "relative",
          padding: "10px",
        }}
        onClick={handleMoveToImageView}
      >
        <img
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          alt=""
          src={screenshot.url}
        />
        <Box
          onClick={(e) => handleImageSelect(e)}
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "20px",
            height: "20px",
            backgroundColor: "white",
            border: "solid",
            borderWidth: "2px",

            borderColor: "primary.main",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isClicked ? <CheckIcon /> : null}
        </Box>
      </Box>
    </Grid>
  );
}
