import React from "react";
import { Grid, Box, Divider, Typography } from "@mui/material";
import { Call } from "src/types";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

interface SingleCallProps {
  call: Call;
}

export default function SingleCall({ call }: SingleCallProps) {
  const navigate = useNavigate();
  const seconds = `0${call.duration % 60}`.slice(-2);
  const minutes = `0${Math.floor(call.duration / 60) % 60}`.slice(-2);
  const durationAsString = `${minutes}:${seconds}`;

  function handleClick() {
    navigate(`/mycalls/${call.id}`);
  }

  return (
    <Box onClick={handleClick}>
      <Grid
        container
        justifyContent="space-between"
        sx={{
          height: "50px",
          width: "100%",
          padding: "10px",
          "&:hover": { backgroundColor: "lightgray" },
        }}
      >
        <Grid
          item
          sm={8}
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Typography>{call.customerName}</Typography>
        </Grid>
        <Grid
          item
          sm={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: { xs: "16px", sm: "20px" } }}>
            {durationAsString}
          </Typography>
        </Grid>
        <Grid
          item
          sm={3}
          alignItems="end"
          sx={{
            display: "flex",
            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: { xs: "16px", sm: "20px" } }}
          >
            {DateTime.fromISO(call.dateCreated).toFormat("HH:mm dd.MM.yyyy")}
          </Typography>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
}
