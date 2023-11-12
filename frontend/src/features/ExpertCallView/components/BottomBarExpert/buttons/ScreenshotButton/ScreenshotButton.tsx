import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CameraEnhanceOutlinedIcon from "@mui/icons-material/CameraEnhanceOutlined";
import { IconButton } from "@mui/material";
import useTakeScreenshot from "src/features/ExpertCallView/hooks/useTakeScreenshot/useTakeScreenshot";
import { Screenshot } from "src/types";

interface ScreenshotButtonProps {
  callId: undefined | string;
  setScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
}

function ScreenshotButton(props: ScreenshotButtonProps) {
  const { setScreenshots, callId } = props;
  const { isDisabled, screenshots, takeScreenshot, isLoading } =
    useTakeScreenshot();
  useEffect(() => {
    setScreenshots(screenshots);
  }, [setScreenshots, screenshots]);
  return (
    <IconButton
      sx={{ backgroundColor: "white" }}
      disabled={isDisabled || isLoading}
      onClick={() => callId && takeScreenshot(callId)}
      size="large"
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <CameraEnhanceOutlinedIcon sx={{ color: "primary.main" }} />
      )}
    </IconButton>
  );
}

export default ScreenshotButton;
