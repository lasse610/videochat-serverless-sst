import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

import CustomerMenuBar from "./components/CustomerMenuBar/CustomerMenuBar";
import CustomerMainParticipant from "./components/CustomerMainParticipant/CustomerMainParticipant";
import ReconnectingNotification from "src/components/ReconnectingNotification/ReconnectingNotification";
import useHeight from "src/hooks/useHeight/useHeight";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import useRoomState from "src/hooks/useRoomState/useRoomState";

import PreJoinCustomer from "./components/PreJoinCustomer/PreJoinCustomer";
import CallEnded from "./components/CallEnded/CallEnded";

const Main = styled("main")(() => ({
  overflow: "hidden",
  background: "black",
  height: "100%",
  backgrundColor: "black",
}));

export default function Customer() {
  const [callEnded, setCallEnded] = useState(false);

  const { room } = useVideoContext();
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  useEffect(() => {
    function endCall() {
      setCallEnded(true);
      room?.disconnect();
    }

    if (room) {
      room.on("disconnected", endCall);
      room.on("participantDisconnected", endCall);
    }
    return () => {
      room?.off("disconnected", endCall);
    };
  });

  return (
    <div style={{ height }}>
      {roomState === "disconnected" && !callEnded && <PreJoinCustomer />}
      {roomState !== "disconnected" && !callEnded && (
        <Main>
          {
            //<CallerInfo />
          }
          <CustomerMainParticipant />
          <ReconnectingNotification />
          <CustomerMenuBar />
        </Main>
      )}

      {callEnded && <CallEnded />}
    </div>
  );
}
