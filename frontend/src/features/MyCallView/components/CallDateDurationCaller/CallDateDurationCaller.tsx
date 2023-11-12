import { Box } from "@mui/system";
import React from "react";
import { Typography } from "@mui/material";
import PhoneForwardedOutlinedIcon from "@mui/icons-material/PhoneForwardedOutlined";

interface CallDateDurationCallerProps {
  caller: string;
  date: string;
  duration: number;
}

export default function CallDateDurationCaller({
  caller,
  date,
  duration,
}: CallDateDurationCallerProps) {
  const seconds = `${duration % 60}`;
  const minutes = `${Math.floor(duration / 60) % 60}`;
  const durationAsString = `${minutes} minutes ${seconds} seconds`;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        gap: "5px",
      }}
    >
      <Typography sx={{ fontSize: "1em" }}>{date}</Typography>
      <Typography sx={{ fontSize: "1em" }}>{durationAsString}</Typography>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <PhoneForwardedOutlinedIcon fontSize="medium" />
        <Typography sx={{ fontWeight: "bold" }}>from {caller}</Typography>
      </Box>
    </Box>
  );
}
