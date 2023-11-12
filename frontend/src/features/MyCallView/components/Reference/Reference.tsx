import React from "react";

import { Typography } from "@mui/material";
import { Box } from "@mui/system";

interface ReferenceProps {
  reference: string;
}

export default function Reference({ reference }: ReferenceProps) {
  return (
    <Box
      sx={{
        backgroundColor: "lightGray",
        paddingY: { xs: "2px", sm: "5px" },
        paddingX: { xs: "2px", sm: "15px" },
        borderRadius: "5px",
      }}
    >
      <Typography
        sx={{ fontStyle: "black", fontSize: { sx: "14px", sm: "20px" } }}
      >
        Reference: {reference}
      </Typography>
    </Box>
  );
}
