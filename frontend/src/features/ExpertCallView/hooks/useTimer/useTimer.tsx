import React, { useState, useEffect } from 'react';
import useRoomState from 'src/hooks/useRoomState/useRoomState';
// dispalys time in minutes:seconds since start

export default function useTimer() {
  const [time, setTime] = useState(0);
  const roomState = useRoomState();

  useEffect(() => {
    if (roomState !== 'disconnected') {
      const interval = setInterval(() => {
        setTime(t => (t += 1));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [roomState]);

  const seconds = `0${time % 60}`.slice(-2);
  const minutes = `0${Math.floor(time / 60) % 60}`.slice(-2);
  const timeAsString = `${minutes}:${seconds}`;
  return { timeAsString, timeAsNumber: time };
}
