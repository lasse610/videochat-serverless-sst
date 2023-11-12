import React from "react";
import { Box } from "@mui/system";

import MenuRightSidecontainer from "../MenuRightSideContainer/MenuRightSideContainer";
import CustomerInfoContainer from "../CustomerInfoContainer/CustomerInfoContainer";
import ToolsContainer from "../ToolsContainer/ToolsContainer";
import DetailsButton from "../../../../../components/DetailsButton/DetailsButton";
import { Screenshot } from "src/types";

interface BottomBarProps {
  callId: undefined | string;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  isUsingMarker: boolean;
  setIsUsingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  customerName: string;
  time: string;
}

function BottomBar(props: BottomBarProps) {
  const {
    callId,
    setLatitude,
    setLongitude,
    showSidebar,
    setShowSidebar,
    setScreenshots,
    isUsingMarker,
    setIsUsingMarker,
    customerName,
    time,
  } = props;

  return (
    <Box
      sx={{
        zIndex: 10,
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#EEEEEE",
        display: "flex",
      }}
    >
      <Box sx={{ flex: 1, justifyContent: "center", display: "flex" }}>
        <DetailsButton
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </Box>
      <ToolsContainer
        callId={callId}
        isUsingMarker={isUsingMarker}
        setIsUsingMarker={setIsUsingMarker}
        setScreenshots={setScreenshots}
      />
      <Box
        sx={{ flex: 1, justifyContent: "center", display: "flex", gap: "20px" }}
      >
        <CustomerInfoContainer customerName={customerName} time={time} />
        <MenuRightSidecontainer
          setLongitude={setLongitude}
          setLatitude={setLatitude}
        />
      </Box>
    </Box>
  );
}

export default BottomBar;
