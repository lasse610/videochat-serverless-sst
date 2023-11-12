import React, { useState, useEffect } from "react";
import useMainParticipant from "src/hooks/useMainParticipant/useMainParticipant";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import useSendDataMessage from "src/hooks/useSendDataMessage/useSendDataMessage";
import useReceiveDataMessage from "../useReceiveDataMessage/useReceiveDataMessage";
import { DataTrackMessage } from "src/types";

export default function useRequestLocation() {
  const [isDisabled, setisDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const { message: receivedMessage } = useReceiveDataMessage();
  const sendMessage = useSendDataMessage();

  useEffect(() => {
    const command = receivedMessage;
    if (!command) return;

    if (command?.type === "location") {
      switch (command.event) {
        case "success": {
          const loc = command.location;
          if (loc) {
            setIsLoading(false);
            setLocation(loc);
          }
          break;
        }
        case "failed":
          setIsLoading(false);
          break;
        default:
          break;
      }
    }
  }, [receivedMessage]);

  useEffect(() => {
    setisDisabled(mainParticipant === localParticipant);
  }, [localParticipant, mainParticipant]);

  function requestLocation() {
    if (!isDisabled) {
      const message: DataTrackMessage = {
        type: "location",
        event: "location",
      };
      setIsLoading(true);
      sendMessage(message);
    }
  }
  return { requestLocation, isDisabled, isLoading, location };
}
