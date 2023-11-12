import React from "react";
import { Box } from "@mui/system";

import DrawToolsContainer from "../DrawToolsContainer/DrawToolsContainer";
import ScreenshotButton from "../buttons/ScreenshotButton/ScreenshotButton";
import { Screenshot } from "src/types";

interface ToolsContainerProps {
  callId: undefined | string;
  isUsingMarker: boolean;
  setIsUsingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
}

function ToolsContainer(props: ToolsContainerProps) {
  const { setScreenshots, setIsUsingMarker, isUsingMarker, callId } = props;
  return (
    <Box
      sx={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        gap: "10px",
      }}
    >
      <ScreenshotButton callId={callId} setScreenshots={setScreenshots} />
      <DrawToolsContainer
        isUsingMarker={isUsingMarker}
        setIsUsingMarker={setIsUsingMarker}
      />
    </Box>
  );
}

export default ToolsContainer;
