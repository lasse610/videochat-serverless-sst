import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React from 'react';
import useMainParticipant from 'src/hooks/useMainParticipant/useMainParticipant';
import useSelectedParticipant from 'src/components/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from 'src/hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from 'src/hooks/useVideoContext/useVideoContext';

interface MainParticipantProps {
  isUsingMarker: boolean;
}

export default function MainParticipant(props: MainParticipantProps) {
  const { isUsingMarker } = props;
  const mainParticipant = useMainParticipant();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    (mainParticipant === selectedParticipant ||
      mainParticipant === screenShareParticipant) &&
    mainParticipant !== localParticipant
      ? 'high'
      : null;

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <ParticipantTracks
      isUsingMarker={isUsingMarker}
      participant={mainParticipant}
      videoOnly
      enableScreenShare={mainParticipant !== localParticipant}
      videoPriority={videoPriority}
      isLocalParticipant={mainParticipant === localParticipant}
    />
  );
}
