import React from "react";
import { Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router";
export default function CallsButton() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/mycalls/");
  }

  return (
    <Button
      onClick={handleClick}
      fullWidth
      startIcon={<AccessTimeIcon />}
      sx={{
        borderRadius: "0px",
        backgroundColor: "#017FFF",
        color: "white",
        paddingY: "10px",
        "&:hover": {
          backgroundColor: "#0245ff",
        },
      }}
    >
      Calls
    </Button>
  );
}
