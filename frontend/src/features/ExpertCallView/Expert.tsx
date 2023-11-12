import React, { useState, useEffect, useCallback } from "react";
import { styled, Theme } from "@mui/material/styles";
import axios from "axios";
import ReconnectingNotification from "src/components/ReconnectingNotification/ReconnectingNotification";
import RecordingNotifications from "src/components/RecordingNotifications/RecordingNotifications";
import BottomBarExpert from "./components/BottomBarExpert";

import useHeight from "src/hooks/useHeight/useHeight";
import useRoomState from "src/hooks/useRoomState/useRoomState";
import MainParticipant from "./components/MainParticipant/MainParticipant";
import useTimer from "./hooks/useTimer/useTimer";
import PreJoinExpert from "./components/PreJoinExpert/PreJoinExpert";
import { Screenshot, Invite } from "src/types";
import { getInviteById } from "../api/invites/Invites";
import { useParams, useNavigate } from "react-router-dom";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import { postCall } from "../api/calls/Calls";
import { useAppState } from "src/context/state";
import CallEnded from "./components/CalleEnded/CallEnded";
const Container = styled("div")({
  display: "grid",
  gridTemplateRows: "1fr auto",
  overflow: "hidden",
});

const Main = styled("main")(({ theme }: { theme: Theme }) => ({
  overflow: "hidden",
  paddingBottom: `50px`, // Leave some space for the footer
  background: "black",
}));

export default function Expert() {
  const roomState = useRoomState();
  const { user } = useAppState();
  const { room } = useVideoContext();
  const { URLRoomName: callId } = useParams();
  const navigate = useNavigate();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();
  const [callEnded, setCallEnded] = useState(false);
  const [reference, setReference] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [screenshotNotes, setScreenshotNotes] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [isUsingMarker, setIsUsingMarker] = useState(true);
  const { timeAsNumber, timeAsString } = useTimer();

  const handleDisconnect = useCallback(async () => {
    if (user) {
      try {
        await postCall({
          notes,
          callId: callId || "",
          duration: timeAsNumber,
          customerName: customerName,
          customerPhoneNumber: "0449916358",
          latitude,
          longitude,
          reference,
          userId: user?.username || "",
          userName: user.name || "no name provided",
        });
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          console.log(error);
        }
      }
    }
  }, [
    callId,
    customerName,
    latitude,
    longitude,
    notes,
    reference,
    timeAsNumber,
    user,
  ]);

  useEffect(() => {
    async function getInvite() {
      try {
        const res = await getInviteById(callId || "");
        const invite = res.data as Invite;
        setCustomerName(invite.customer_name);
        setReference(invite.reference);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 404
        ) {
          navigate("/mycalls/");
        }
      }
    }
    getInvite();
  }, [callId, navigate]);

  useEffect(() => {
    if (callEnded) {
      handleDisconnect();
    }
  }, [handleDisconnect, callEnded]);

  useEffect(() => {
    function endCall() {
      setCallEnded(true);
      room?.disconnect();
      room?.removeAllListeners();
    }

    room?.on("disconnected", endCall);
    room?.on("participantDisconnected", endCall);
    return () => {
      console.log("removing listeners");
      room?.off("disconnect", endCall);
      room?.off("participantDisconnected", endCall);
    };
  }, [room, handleDisconnect]);

  return (
    <Container style={{ height }}>
      {roomState === "disconnected" && !callEnded && (
        <PreJoinExpert user={user} />
      )}
      {roomState !== "disconnected" && (
        <Main>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MainParticipant isUsingMarker={isUsingMarker} />
          <BottomBarExpert
            callId={callId}
            setLongitude={setLongitude}
            setLatitude={setLatitude}
            time={timeAsString}
            isUsingMarker={isUsingMarker}
            setIsUsingMarker={setIsUsingMarker}
            notes={notes}
            setNotes={setNotes}
            screenshotNotes={screenshotNotes}
            setScreenshotNotes={setScreenshotNotes}
            screenshots={screenshots}
            setScreenshots={setScreenshots}
            customerName={customerName}
          />
        </Main>
      )}

      {callEnded && <CallEnded />}
    </Container>
  );
}
