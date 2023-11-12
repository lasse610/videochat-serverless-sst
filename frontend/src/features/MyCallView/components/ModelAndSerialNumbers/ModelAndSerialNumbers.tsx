import React from "react";
import { Box, Typography } from "@mui/material";
import Number from "../Number/Number";
import { Screenshot } from "src/types";

interface ModelAndSerialNumbersProps {
  screenshots: Screenshot[] | undefined;
}
export default function ModelAndSerialNumbers({
  screenshots,
}: ModelAndSerialNumbersProps) {
  const numbers = screenshots
    ? screenshots.flatMap((shot) => shot.serialnumbers)
    : [];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Typography sx={{ fontWeight: "bold" }}>
        Model And Serial Numbers
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {numbers.length > 0 && screenshots
          ? screenshots.map((shot: Screenshot) => {
              return shot.serialnumbers.map((number) => {
                return <Number key={number} number={number} />;
              });
            })
          : "No Serial or Model Numbers Found"}
      </Box>
    </Box>
  );
}
