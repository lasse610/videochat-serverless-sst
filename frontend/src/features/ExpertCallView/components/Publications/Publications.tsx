import React from 'react';
import {
  RemoteDataTrackPublication,
  LocalDataTrackPublication,
  RemoteVideoTrackPublication,
  LocalVideoTrackPublication,
  RemoteAudioTrackPublication,
  LocalAudioTrackPublication,
  DataTrack as IDataTrack,
  AudioTrack as IAudioTrack,
  Participant,
} from 'twilio-video';
import { IVideoTrack } from 'src/types';

import useTrack from 'src/hooks/useTrack/useTrack';
import AudioTrack from 'src/components/AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import DataTrack from '../DataTrack/DataTrack';
import useResizeObserver from 'src/hooks/useResizeObserver/useResizeObserver';

interface PublicationProps {
  dataPublication:
    | RemoteDataTrackPublication
    | LocalDataTrackPublication
    | undefined;
  videoPublication:
    | RemoteVideoTrackPublication
    | LocalVideoTrackPublication
    | undefined;
  audioPublication:
    | RemoteAudioTrackPublication
    | LocalAudioTrackPublication
    | undefined;
  participant: Participant;
  isLocalParticipant?: boolean;
  isUsingMarker?: boolean;
}

export default function Publications({
  audioPublication,
  dataPublication,
  videoPublication,
  isLocalParticipant,
  isUsingMarker,
}: PublicationProps) {
  const {
    containerWidth,
    containerHeight,
    resizeObserverRef,
  } = useResizeObserver();
  const audioTrack = useTrack(audioPublication);
  const videoTrack = useTrack(videoPublication);
  const dataTrack = useTrack(dataPublication);

  return (
    <>
      {audioTrack && <AudioTrack track={audioTrack as IAudioTrack} />}
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      >
        {videoTrack && (
          <div ref={resizeObserverRef}>
            <VideoTrack
              track={videoTrack as IVideoTrack}
              isLocal={isLocalParticipant}
            />
          </div>
        )}

        {dataTrack && (
          <DataTrack
            track={dataTrack as IDataTrack}
            width={containerWidth}
            height={containerHeight}
            isLocal={isLocalParticipant}
            isUsingMarker={!!isUsingMarker}
          />
        )}
      </div>
    </>
  );
}
