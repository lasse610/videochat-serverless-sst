import React, { useRef, useEffect } from "react";
import { IVideoTrack } from "src/types";
import { styled } from "@mui/material/styles";
import { Track } from "twilio-video";
import useMediaStreamTrack from "src/hooks/useMediaStreamTrack/useMediaStreamTrack";
import useMediaRecorder from "src/hooks/useMediaRecorder/useMediaRecorder";
import { useParams } from "react-router-dom";

const Video = styled("video")({});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({
  track,
  isLocal,
  priority,
}: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);
  const { URLRoomName: callId } = useParams();
  const { start, stop, isReady } = useMediaRecorder(callId);

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    if (isReady) {
      start();
    }

    return () => {
      track.detach(el);
      if (isReady) {
        stop();
      }
      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;

      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority, isReady, start, stop]);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing =
    mediaStreamTrack?.getSettings().facingMode !== "environment";

  const style = {
    transform: isLocal && isFrontFacing ? "rotateY(180deg)" : "",
    width: "100%",
    height: "100%",
  };

  return <Video ref={ref} style={style} />;
}
