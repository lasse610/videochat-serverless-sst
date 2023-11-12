import React from "react";
import { Box, Grid, Divider } from "@mui/material";
import BackToCallsButton from "../buttons/BackToCallsButton/BackToCallsButton";
import Reference from "../Reference/Reference";
import CustomerName from "../CustomerName/CustomerName";
import ReSendInvitationButton from "../buttons/ReSendInvitationButton/ReSendInvitationButton";
import ShareCallButton from "../buttons/ShareCallButton/ShareCallButton";
import CallDateDurationCaller from "../CallDateDurationCaller/CallDateDurationCaller";
import Location from "../Location/Location";
import CallNotes from "../CallNotes/CallNotes";
import ModelAndSerialNumbers from "../ModelAndSerialNumbers/ModelAndSerialNumbers";
import { Call } from "src/types";
import Map from "src/features/MyCallView/components/Map/Map";

interface CallInfoSectionProps {
  call: Call;
}

export default function CallInfoSection({ call }: CallInfoSectionProps) {
  console.log(call);
  return (
    <Box>
      <Grid
        container
        justifyContent="space-around"
        spacing={10}
        alignItems="center"
      >
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: { xs: "5px", sm: "10px" },
          }}
        >
          <BackToCallsButton />
          <Reference reference={call.reference} />
          <CustomerName name={call.customerName} />
          <ReSendInvitationButton number={call.customerPhoneNumber} />
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            gap: "15px",
          }}
        >
          {
            false && <ShareCallButton /> // TODO
          }
          <CallDateDurationCaller
            date={call.dateCreated}
            duration={call.duration}
            caller={call.userName}
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        sx={{ paddingTop: "20px", height: "100%" }}
      >
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "20px",
          }}
        >
          <Location longitude={call.longitude} latitude={call.latitude} />
          <CallNotes notes={call.notes} />
        </Grid>

        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: "20px",
          }}
        >
          {call.longitude !== "0" && (
            <Map longitude={call.longitude} latitude={call.latitude} />
          )}
          <ModelAndSerialNumbers screenshots={call.screenshots} />
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
}
