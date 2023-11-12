import React from "react";
import { Box, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

interface LocationProps {
  latitude: string;
  longitude: string;
}

export default function Location(props: LocationProps) {
  const locationIcon = <LocationOnOutlinedIcon />;
  const location = { latitude: props.latitude, longitude: props.longitude };
  // display no location found if no location and a map if location was submitted
  const locationString =
    location.latitude !== "0" || location.longitude !== "0"
      ? `${location.latitude}, ${location.longitude}`
      : "No GPS location found.";
  return (
    <Box>
      <Typography sx={{ fontWeight: "bold", padding: "10px" }}>
        Location
      </Typography>

      <Typography sx={{ padding: "10px" }}>
        {locationIcon} {locationString}
      </Typography>
    </Box>
  );
}
