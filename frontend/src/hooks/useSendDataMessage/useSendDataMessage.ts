import { useEffect, useState } from 'react';
import useVideoContext from 'src/hooks/useVideoContext/useVideoContext';
import { LocalDataTrack } from 'twilio-video';
import { DataTrackMessage } from 'src/types';

// Return function to send messages on datatrack
// {type: string, event: string, info?:{pointer: {x:number, y: number}, width: number, height: number}}
const useSendDataMessage = () => {
  const [track, setTrack] = useState<LocalDataTrack>();
  const { getLocalDataTrack } = useVideoContext();

  useEffect(() => {
    setTrack(getLocalDataTrack());
  }, [getLocalDataTrack]);

  const sendMessage = (payload: DataTrackMessage) => {
    if (track) {
      switch (true) {
        case !!payload.type:
          track.send(JSON.stringify(payload)); // Sanitize??
          break;
        default:
      }
    }
  };
  return sendMessage;
};

export default useSendDataMessage;
