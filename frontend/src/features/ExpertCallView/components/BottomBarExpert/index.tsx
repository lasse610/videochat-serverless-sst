import React, { useState } from "react";
import BottomBar from "./BottomBar/BottomBar";
import AnimatedSidebar from "src/components/AnimatedSidebar/AnimatedSIdebar";
import { Screenshot } from "src/types";
import NotesTabs from "./NotesTabs/NotesTabs";

interface BottomBarProps {
  callId: string | undefined;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  isUsingMarker: boolean;
  setIsUsingMarker: React.Dispatch<React.SetStateAction<boolean>>;
  screenshots: Screenshot[];
  setScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
  screenshotNotes: string[];
  setScreenshotNotes: React.Dispatch<React.SetStateAction<string[]>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  customerName: string;
  time: string;
}

export default function BottomBarExpert(props: BottomBarProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const {
    callId,
    setLongitude,
    setLatitude,
    isUsingMarker,
    setIsUsingMarker,
    screenshots,
    setScreenshots,
    screenshotNotes,
    setScreenshotNotes,
    notes,
    setNotes,
    customerName,
    time,
  } = props;

  return (
    <>
      <BottomBar
        callId={callId}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        time={time}
        customerName={customerName}
        isUsingMarker={isUsingMarker}
        setIsUsingMarker={setIsUsingMarker}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        setScreenshots={setScreenshots}
      />
      <AnimatedSidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      >
        <NotesTabs
          setNotes={setNotes}
          notes={notes}
          screenshots={screenshots}
          screenshotNotes={screenshotNotes}
          setScreenshotNotes={setScreenshotNotes}
        />
      </AnimatedSidebar>
    </>
  );
}
