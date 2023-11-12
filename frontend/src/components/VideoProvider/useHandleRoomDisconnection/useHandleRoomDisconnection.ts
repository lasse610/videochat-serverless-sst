import { Room, TwilioError } from 'twilio-video';
import { useEffect } from 'react';

import { Callback } from '../../../types';

export default function useHandleRoomDisconnection(
  room: Room | null,
  onError: Callback,
  removeLocalDataTrack: () => void,
  removeLocalAudioTrack: () => void,
  removeLocalVideoTrack: () => void
) {
  useEffect(() => {
    if (room) {
      const onDisconnected = (_: Room, error: TwilioError) => {
        if (error) {
          onError(error);
        }
        removeLocalDataTrack();
        removeLocalAudioTrack();
        removeLocalVideoTrack();
      };

      room.on('disconnected', onDisconnected);
      return () => {
        room.off('disconnected', onDisconnected);
      };
    }
  }, [
    room,
    onError,
    removeLocalDataTrack,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
  ]);
}
