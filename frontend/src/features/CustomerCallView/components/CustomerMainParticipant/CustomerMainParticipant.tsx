import React from "react";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import useMainParticipant from "src/hooks/useMainParticipant/useMainParticipant";
import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";
import useSelectedParticipant from "src/components/VideoProvider/useSelectedParticipant/useSelectedParticipant";
import useScreenShareParticipant from "src/hooks/useScreenShareParticipant/useScreenShareParticipant";
export default function CustomerMainParticipant() {
  // used to size canvas correctly
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const videoPriority =
    (mainParticipant === selectedParticipant ||
      mainParticipant === screenShareParticipant) &&
    mainParticipant !== localParticipant
      ? "high"
      : null;

  return (
    <ParticipantTracks
      localParticipant={localParticipant}
      participant={mainParticipant}
      videoOnly
      enableScreenShare={mainParticipant !== localParticipant}
      videoPriority={videoPriority}
      isLocalParticipant={mainParticipant === localParticipant}
    />
  );
}
