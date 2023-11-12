import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAppState } from "src/context/state";

export default function LogoutButton() {
  const { logout } = useAppState();
  const navigate = useNavigate();
  function handleClick() {
    logout();
    navigate("/login/");
  }
  return (
    <Button
      onClick={handleClick}
      sx={{
        borderRadius: "100px",
        paddingX: "40px",
        backgroundColor: "primary.main",
        color: "white",
        "&:hover": {
          backgroundColor: "#0245FF",
        },
      }}
    >
      Log Out
    </Button>
  );
}
