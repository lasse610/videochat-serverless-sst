import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  postScreenshotData,
  requestUploadUrl,
} from "src/features/api/screenshots/Screenshots";
import useMainParticipant from "src/hooks/useMainParticipant/useMainParticipant";
import useSendDataMessage from "src/hooks/useSendDataMessage/useSendDataMessage";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import { DataTrackMessage, Screenshot } from "src/types";

import useReceiveDataMessage from "../useReceiveDataMessage/useReceiveDataMessage";

// use only inside video provider
export default function useTakeScreenshot() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isDisabled, setisDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const { message: receivedMessage, setMessage } = useReceiveDataMessage();
  const { URLRoomName: callId } = useParams();

  const sendMessage = useSendDataMessage();

  useEffect(() => {
    async function handleSuccess(key: string | undefined) {
      if (callId && key) {
        const response = await postScreenshotData(callId, key);
        setIsLoading(false);
        if (response.data) {
          setScreenshots((shots) => shots.concat(response.data));
          setMessage(undefined);
          return;
        }
      }
      setIsLoading(false);
      return;
    }

    const command = receivedMessage;
    if (!command) return;

    if (command?.type === "screenshot") {
      switch (command.event) {
        case "success": {
          console.log(command);
          console.log(room);
          const { key } = command;

          handleSuccess(key);

          break;
        }
        case "failed":
          setIsLoading(false);
          setMessage(undefined);
          break;
        default:
          setIsLoading(false);
          break;
      }
    }
  }, [receivedMessage, room, setMessage, callId]);

  useEffect(() => {
    setisDisabled(mainParticipant === localParticipant);
  }, [localParticipant, mainParticipant]);

  async function takeScreenshot(callId: string) {
    if (!isDisabled) {
      const res = await requestUploadUrl(callId);
      const { presignedUrl, key } = res.data;

      if (presignedUrl && key) {
        const message: DataTrackMessage = {
          type: "screenshot",
          event: "screenshot",
          presignedUrl,
          key: key,
        };
        setIsLoading(true);
        sendMessage(message);
      }
    }
  }

  return { isDisabled, screenshots, takeScreenshot, isLoading };
}
