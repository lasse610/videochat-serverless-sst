import React from "react";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function BackToCallsButton() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/mycalls/");
  }
  return (
    <Button
      onClick={handleClick}
      sx={{
        textTransform: "none",
        color: "black",
        fontWeight: "bold",
        fontSize: { sx: "16px", sm: "20px" },
      }}
      startIcon={<ArrowBackIcon />}
    >
      Back To Calls
    </Button>
  );
}
