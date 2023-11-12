import React, { useRef, useEffect } from "react";
import { DataTrack as IDataTrack, LocalVideoTrack } from "twilio-video";
import { fabric } from "fabric";
import { Point } from "fabric/fabric-impl";
import { useParams } from "react-router";
import { CanvasMouseEvent } from "src/types";
import useReceiveDataMessage from "src/features/ExpertCallView/hooks/useReceiveDataMessage/useReceiveDataMessage";
import useTrack from "src/hooks/useTrack/useTrack";
import useVideoContext from "src/hooks/useVideoContext/useVideoContext";
import usePublications from "src/hooks/usePublications/usePublications";
import useMediaStreamTrack from "src/hooks/useMediaStreamTrack/useMediaStreamTrack";
import { DataTrackMessage } from "src/types";
import useSendDataMessage from "src/hooks/useSendDataMessage/useSendDataMessage";
import { postScreenshotImage } from "src/features/api/screenshots/Screenshots";
import getBlobFromMediaTrack from "../../utils/getBlobFromMediaStreamTrack";

/////CUSTOMER VIEW

interface DataTrackProps {
  height: number;
  width: number;
  track: IDataTrack;
  isLocal?: boolean;
}

interface Position {
  coords: { latitude: number; longitude: number };
}

interface PBursh extends fabric.PencilBrush {
  onMouseMove(pointer: object, e: object): () => void;
  onMouseDown(pointer: object, e: object): () => void;
  onMouseUp(e: object): () => void;
}

export default function DataTrack({
  height,
  width,
  track,
  isLocal,
}: DataTrackProps) {
  const { room } = useVideoContext();
  const { URLRoomName } = useParams();
  const localParticipant = room!.localParticipant;
  const publications = usePublications(localParticipant);
  const localVideoTrack = useTrack(
    publications.find((p) => p.kind === "video")
  ) as LocalVideoTrack;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  const sendMessage = useSendDataMessage();
  const { message, setMessage } = useReceiveDataMessage();
  const brush = useRef<PBursh>();
  const screenshotVideo = useRef<HTMLVideoElement>(null);
  const screenshotCanvas = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<fabric.Canvas>();
  const circle = useRef<fabric.Circle>(
    new fabric.Circle({
      left: 1,
      top: 1,
      fill: "red",
      radius: 10,
      hasControls: false,
      selectable: false,
      visible: false,
    })
  );

  useEffect(() => {
    const command = message;
    console.log("here");

    //cancel if no message has been received
    if (!command) return;

    const handleScreenshot = async (uploadUrl: string, key: string) => {
      const messageFailed = () => {
        const payload: DataTrackMessage = {
          type: "screenshot",
          event: "failed",
        };
        sendMessage(payload);
      };

      try {
        console.log(command);
        const blob = (await getBlobFromMediaTrack(
          mediaStreamTrack!,
          screenshotVideo,
          screenshotCanvas
        )) as Blob;
        console.log(blob.type);

        await postScreenshotImage(uploadUrl, blob);
        const payload: DataTrackMessage = {
          type: "screenshot",
          event: "success",
          key,
        };
        console.log(payload);
        sendMessage(payload);
        setMessage(undefined);
      } catch (error) {
        messageFailed();
        setMessage(undefined);
      }
    };

    const handleTranslation = (info: CanvasMouseEvent | undefined) => {
      let newPointer = { x: 0, y: 0 };
      if (info) {
        const pointer = info.pointer;
        const translateWidth = width / info.width;
        const translateHeight = height / info.height;
        newPointer = {
          x: translateWidth * pointer.x,
          y: translateHeight * pointer.y,
        } as Point;
      }
      return newPointer;
    };

    if (command.info?.width === 0 || command.info?.height === 0) return;
    const newPointer = handleTranslation(command.info);
    const options = { newPointer, e: {} };
    switch (command.event) {
      case "mouseDown":
        if (command.drawStyle === "marker") {
          brush.current?.onMouseDown(newPointer, options);
        } else {
          const x = newPointer.x - (circle.current?.radius || 0);
          const y = newPointer.y - (circle.current?.radius || 0);
          circle.current.set("top", y);
          circle.current.set("left", x);
          circle.current.set("visible", true);
          canvas.current?.requestRenderAll();
        }
        break;
      case "mouseMove":
        if (command.drawStyle === "marker") {
          brush.current?.onMouseMove(newPointer, options);
        } else {
          const x = newPointer.x - (circle.current?.radius || 0);
          const y = newPointer.y - (circle.current?.radius || 0);
          circle.current.set("top", y);
          circle.current.set("left", x);
          canvas.current?.requestRenderAll();
        }
        break;
      case "mouseUp":
        if (command.drawStyle === "marker") {
          brush.current?.onMouseUp(options);
        } else {
          circle.current.set("visible", false);
          canvas.current?.requestRenderAll();
        }
        break;
      case "clearCanvas":
        canvas.current?.clear();
        canvas.current?.add(circle.current);
        canvas.current?.renderAll();
        break;
      case "screenshot":
        console.log(command);
        if (command.presignedUrl && command.key) {
          handleScreenshot(command.presignedUrl, command.key);
        }
        break;
      case "location": {
        const success = (coords: Position) => {
          const payload: DataTrackMessage = {
            type: "location",
            event: "success",
            location: {
              latitude: coords.coords.latitude,
              longitude: coords.coords.longitude,
            },
          };
          sendMessage(payload);
        };

        const failed = () => {
          const payload: DataTrackMessage = {
            type: "location",
            event: "failed",
          };
          sendMessage(payload);
        };
        navigator.geolocation.getCurrentPosition(success, failed);
        break;
      }
      default:
        break;
    }

    return () => {};
  }, [
    message,
    height,
    width,
    mediaStreamTrack,
    URLRoomName,
    sendMessage,
    setMessage,
  ]);

  useEffect(() => {
    if (!canvas.current) {
      canvas.current = new fabric.Canvas("canvas", { selection: false });
      canvas.current.freeDrawingBrush.width = 10;
      canvas.current.freeDrawingBrush.color = "rgb(255,0,0)";
      brush.current = new fabric.PencilBrush(canvas.current) as PBursh;
      brush.current.width = 10;
      brush.current.color = "rgb(255,0,0)";
      canvas.current.add(circle.current);
    }
  }, [canvas]);

  useEffect(() => {
    canvas.current?.setHeight(height);
    canvas.current?.setWidth(width);
  }, [canvas, width, height]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}>
      <canvas id={"canvas"}></canvas>
      <div style={{ display: "none" }}>
        <video id="screenshotVideo" ref={screenshotVideo}></video>
        <canvas id="screenshotCanvas" ref={screenshotCanvas}></canvas>
      </div>
    </div>
  );
}
