import React, { useEffect } from "react";
import { Box, CircularProgress, Button, Typography } from "@mui/material";

import { useParams } from "react-router-dom";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import { useAppState } from "src/context/state";
import { IUser } from "src/types";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface PreJoinExpertProps {
  user: IUser | null;
}

export default function PreJoinExpert({ user }: PreJoinExpertProps) {
  const { isFetching, getToken } = useAppState();
  const {
    getAudioAndVideoTracks,
    connect: videoConnect,
    isAcquiringLocalTracks,
    isConnecting,
    localTracks,
  } = useVideoContext();
  const { URLRoomName } = useParams();
  const disableButtons =
    isAcquiringLocalTracks || isConnecting || isFetching || !user;
  const hasAudioTrack = localTracks.some((track) => track.kind === "audio");
  const hasVideoTrack = localTracks.some((track) => track.kind === "video");

  useEffect(() => {
    getAudioAndVideoTracks();
  }, [getAudioAndVideoTracks]);

  const handleJoin = () => {
    getToken(user!.username, URLRoomName || "").then(({ token }) => {
      videoConnect(token);
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {(hasAudioTrack || hasVideoTrack) && (
        <Box sx={{ display: "flex" }}>
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

      {disableButtons && <CircularProgress />}

      <Button
        disabled={disableButtons}
        onClick={handleJoin}
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
