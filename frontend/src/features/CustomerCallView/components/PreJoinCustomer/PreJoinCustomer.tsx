import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import MediaErrorSnackbar from "src/components/MediaErrorSnackbar/MediaErrorSnackbar";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";

import { getInviteById } from "src/features/api/invites/Invites";
import { Invite } from "src/types";
import { useAppState } from "src/context/state";
import { useSocketContext } from "src/context/socketContext/socketContext";

export default function PreJoinCustomer() {
  const [invite, setInvite] = useState<Invite>();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [checked, setChecked] = useState(false);
  const [mediaError, setMediaError] = useState<Error>();
  const { socket } = useSocketContext();
  const { getToken, isFetching } = useAppState();
  const {
    localTracks,
    getAudioAndVideoTracks,
    connect: videoConnect,
    isAcquiringLocalTracks,
    isConnecting,
  } = useVideoContext();
  const disableButtons =
    isFetching || isAcquiringLocalTracks || isConnecting || !invite || !checked;
  const hasAudioTrack = localTracks.some((track) => track.kind === "audio");
  const hasVideoTrack = localTracks.some((track) => track.kind === "video");

  const { URLRoomName } = useParams();

  const handleJoin = async () => {
    if (invite && invite.customer_name && URLRoomName && socket.current) {
      const res = await getToken(invite.customer_name, URLRoomName);
      console.log(res.token);
      await videoConnect(res.token);
      socket.current.send(
        JSON.stringify({
          action: "callUser",
          data: {
            customerName: invite.customer_name,
            userId: invite.user_id,
            uuid: invite.id,
          },
        })
      );
    }
  };

  useEffect(() => {
    if (invite && checked && !mediaError) {
      getAudioAndVideoTracks().catch((error) => {
        console.log("Error acquiring local media:");
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, invite, checked, mediaError]);

  useEffect(() => {
    async function getInvite() {
      try {
        const res = await getInviteById(URLRoomName || "");
        setInvite(res.data as Invite);
        console.log(res.data);
      } catch (error) {
        setShouldRedirect(true);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          console.log(error);
        }
      }
    }
    getInvite();
  }, [URLRoomName]);

  // check if invitation exists. If not redirect away else show preJoinScreen
  if (shouldRedirect) return <Navigate to="/login" />;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <MediaErrorSnackbar error={mediaError} />
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "30px",
          padding: "20px",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>
          You have been invited to a call by
        </Typography>

        <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>
          {invite?.agent_name}
        </Typography>
        {invite?.reference && (
          <>
            <Typography>about: {invite?.reference}</Typography>
          </>
        )}
      </Card>
      <Box>
        <FormControlLabel
          label="Get audio and video"
          control={
            <Checkbox
              checked={checked}
              onChange={() => setChecked((check) => !check)}
            />
          }
        />
      </Box>
      {(hasAudioTrack || hasVideoTrack) && (
        <Box>
          <Typography>
            {hasVideoTrack ? (
              <CheckIcon sx={{ color: "green" }} />
            ) : (
              <CloseIcon sx={{ color: "red" }} />
            )}{" "}
            Video
          </Typography>
          <Typography>
            {hasAudioTrack ? (
              <CheckIcon sx={{ color: "green" }} />
            ) : (
              <CloseIcon sx={{ color: "red" }} />
            )}{" "}
            Audio
          </Typography>
        </Box>
      )}

      <Button
        onClick={handleJoin}
        disabled={disableButtons}
        sx={{
          backgroundColor: disableButtons ? "lightgray" : "primary.main",
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
        Join
      </Button>
    </Box>
  );
}
