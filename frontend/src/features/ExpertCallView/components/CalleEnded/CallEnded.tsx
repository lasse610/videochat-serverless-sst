import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router";
export default function CallEnded() {
  const { URLRoomName } = useParams();
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/mycalls/${URLRoomName}`);
  }
  return (
    <Box
      onClick={handleClick}
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <Typography sx={{ fontWeight: "bold" }}>
        The call has ended. You can move to the call document by pressing the
        button below
      </Typography>
      <Button
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          textTransform: "none",
          paddingX: "50px",
          borderRadius: "100px",
          borderStyle: "solid",
          borderWidth: "4px",
          fontSize: "30px",
          "&:hover": {
            backgroundColor: "white",
            borderColor: "primary.main",
            color: "primary.main",
          },
        }}
      >
        Click Here
      </Button>
    </Box>
  );
}
