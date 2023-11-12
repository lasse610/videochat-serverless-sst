import React from 'react';
import { LocalAudioTrack, RemoteAudioTrack } from 'twilio-video';
import AudioLevelIndicator from 'src/components/AudioLevelIndicator/AudioLevelIndicator';
import useMainParticipant from 'src/hooks/useMainParticipant/useMainParticipant';
import usePublications from 'src/hooks/usePublications/usePublications';
import useTrack from 'src/hooks/useTrack/useTrack';

function CustomerAudioIcon() {
  const mainParticipant = useMainParticipant();
  const publications = usePublications(mainParticipant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const audioTrack = useTrack(audioPublication) as
    | LocalAudioTrack
    | RemoteAudioTrack
    | undefined;

  return <AudioLevelIndicator audioTrack={audioTrack} color="black" />;
}

export default CustomerAudioIcon;
