import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Grid } from "@mui/material";
import { Call } from "src/types";
import SingleCall from "./components/SingleCall/SingleCall";
import { getCalls } from "../api/calls/Calls";
import TopSection from "./components/TopSection/TopSection";
import { Divider } from "@mui/material";

export default function MyCalls() {
  const [calls, setCalls] = useState<Call[]>([]);
  useEffect(() => {
    async function fetchCalls() {
      try {
        const res = await getCalls();
        setCalls(res.data);
        console.log(res.data);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          console.log(error.message);
        }
      }
    }

    fetchCalls();
  }, []);

  return (
    <Box>
      <TopSection />
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={8} sx={{ display: "flex", justifyContent: "start" }}>
          <Typography>CALLER</Typography>
        </Grid>
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>DURATION</Typography>
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>DATE</Typography>
        </Grid>
      </Grid>
      <Divider />
      {calls &&
        calls.map((call) => {
          return <SingleCall key={call.id} call={call} />;
        })}
    </Box>
  );
}
