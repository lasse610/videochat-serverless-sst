import React, { useEffect, useState } from "react";
import useTrack from "src/hooks/useTrack/useTrack";
import usePublications from "src/hooks/usePublications/usePublications";
import useMainParticipant from "src/hooks/useMainParticipant/useMainParticipant";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import { DataTrackMessage } from "src/types";
import { RemoteDataTrack } from "twilio-video";

export default function useReceiveDataMessage() {
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const isLocal = mainParticipant === localParticipant;

  const participantPublications = usePublications(mainParticipant);
  const dataTrack = useTrack(
    participantPublications.find((p) => p.kind === "data")
  ) as RemoteDataTrack;
  const [message, setMessage] = useState<DataTrackMessage>();

  useEffect(() => {
    const messageHandler = (data: string) => {
      const command = JSON.parse(data) as DataTrackMessage;
      setMessage(command);
    };
    if (!isLocal && dataTrack) {
      dataTrack.on("message", messageHandler);
    }
    return () => {
      if (!isLocal && dataTrack) {
        dataTrack.off("message", messageHandler);
      }
    };
  }, [dataTrack, isLocal]);

  return { message, setMessage };
}
