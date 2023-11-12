import React, { useRef, useEffect, useState, useCallback } from "react";
import { DataTrack as IDataTrack } from "twilio-video";
import useSendDataMessage from "src/hooks/useSendDataMessage/useSendDataMessage";
import { fabric } from "fabric";
import { DataTrackMessage } from "src/types";

interface ExpertDataTrackProps {
  isUsingMarker: boolean;
  height: number;
  width: number;
  track: IDataTrack;
  isLocal?: boolean;
}

export default function DataTrack({
  isUsingMarker,
  width,
  height,
  isLocal,
}: ExpertDataTrackProps) {
  // Dumb shit to get local video. Must be made better in future

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();

  const [isMouseDown, setIsMouseDown] = useState<Boolean>(false);
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
  const canvas = useRef<fabric.Canvas>();
  const sendMessage = useSendDataMessage();
  const clearCanvas = useCallback(() => {
    canvas.current?.clear();
    const payload: DataTrackMessage = {
      type: "canvas",
      event: "clearCanvas",
    };
    sendMessage(payload);
  }, [canvas, sendMessage]);
  useEffect(() => {
    if (!canvas.current) {
      canvas.current = new fabric.Canvas("canvas");
      canvas.current.selection = false;
      canvas.current.add(circle.current);
    }
  }, [canvas]);

  //Change is canvas freeDrawMode on/off

  useEffect(() => {
    const handleDrawToolChange = () => {
      if (!isUsingMarker && canvas.current) {
        if (timer) {
          clearTimeout(timer);
          setTimer(undefined);
        }
        clearCanvas();
        canvas.current.isDrawingMode = false;
        canvas.current.add(circle.current);
        canvas.current.renderAll();
      }
    };

    if (!canvas.current) return;

    if (isUsingMarker) {
      canvas.current.isDrawingMode = true;
      canvas.current.freeDrawingBrush.width = 10;
      canvas.current.freeDrawingBrush.color = "rgb(255,0,0)";
      canvas.current.renderAll();
    } else {
      handleDrawToolChange();
    }
  }, [canvas, isUsingMarker, clearCanvas, timer]);

  useEffect(() => {
    canvas.current?.setHeight(height);
    canvas.current?.setWidth(width);
  }, [canvas, width, height]);

  const clearCanvasAfterTimeout = () => {
    setTimer(
      setTimeout(() => {
        clearCanvas();
      }, 3000)
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    const pointer = canvas.current?.getPointer(e.nativeEvent);
    if (!pointer) return;

    if (timer && isUsingMarker) {
      clearTimeout(timer);
      setTimer(undefined);
    } else if (!isUsingMarker) {
      const x = pointer.x - (circle.current?.radius || 0);
      const y = pointer.y - (circle.current?.radius || 0);
      circle.current.set("top", y);
      circle.current.set("left", x);
      circle.current.set("visible", true);
      canvas.current?.requestRenderAll();
    }

    // Send message through RemoteDataTrack
    if (!isLocal) {
      const payload: DataTrackMessage = {
        type: "canvas",
        event: "mouseDown",
        drawStyle: isUsingMarker ? "marker" : "laserPointer",
        info: { pointer: pointer, height: height, width: width },
      };
      sendMessage(payload);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsMouseDown(false);
    const pointer = canvas.current?.getPointer(e.nativeEvent);
    if (!pointer) return;
    if (isUsingMarker) {
      clearCanvasAfterTimeout();
    } else {
      circle.current.set("visible", false);
      canvas.current?.requestRenderAll();
    }
    if (!isLocal) {
      const payload: DataTrackMessage = {
        type: "canvas",
        event: "mouseUp",
        drawStyle: isUsingMarker ? "marker" : "laserPointer",
        info: { pointer: pointer, height: height, width: width },
      };
      sendMessage(payload);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      const pointer = canvas.current?.getPointer(e.nativeEvent);
      if (pointer) {
        if (!isUsingMarker) {
          const x = pointer.x - (circle.current?.radius || 0);
          const y = pointer.y - (circle.current?.radius || 0);
          circle.current.set("top", y);
          circle.current.set("left", x);
          canvas.current?.requestRenderAll();
        }
        // Send message through RemoteDataTrack
        if (!isLocal) {
          const payload: DataTrackMessage = {
            type: "canvas",
            event: "mouseMove",
            drawStyle: isUsingMarker ? "marker" : "laserPointer",
            info: { pointer: pointer, height: height, width: width },
          };
          sendMessage(payload);
        }
      }
    }
  };

  return (
    <div
      style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    >
      <canvas id={"canvas"}></canvas>
    </div>
  );
}
