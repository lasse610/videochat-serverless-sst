import React from "react";
import { Box } from "@mui/system";
import DetailsButton from "../DetailsButton/DetailsButton";

interface AnimatedSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  children: React.ReactNode;
}

export default function AnimatedSidebar(props: AnimatedSidebarProps) {
  const { children, showSidebar, setShowSidebar } = props;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "33%",
        minWidth: "400px",
        zIndex: 10,
        height: "100%",
        backgroundColor: "white",
        borderBottomRightRadius: "25px",
        transition: "1s",
        marginLeft: "min(-33%, -400px)",
        transform: showSidebar ? "translateX(max(99%, 400px))" : "",
      }}
    >
      {children}

      <Box sx={{ position: "absolute", right: 0, bottom: 0 }}>
        <DetailsButton
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </Box>
    </Box>
  );
}
