import React from "react";
import {
  Participant,
  Track,
  RemoteDataTrackPublication,
  LocalDataTrackPublication,
  RemoteVideoTrackPublication,
  LocalVideoTrackPublication,
  RemoteAudioTrackPublication,
  LocalAudioTrackPublication,
} from "twilio-video";
import { IVideoTrack } from "src/types";
import Publications from "../Publications/Publications";
import usePublications from "src/hooks/usePublications/usePublications";
import useHeight from "src/hooks/useHeight/useHeight";
import useTrack from "src/hooks/useTrack/useTrack";
import useVideoTrackDimensions from "src/hooks/useVideoTrackDimensions/useVideoTrackDimensions";

interface ParticipantTracksProps {
  isUsingMarker?: boolean;
  participant: Participant;
  localParticipant: Participant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
  isLocalParticipant?: boolean;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

export default function ParticipantTracks({
  isUsingMarker,
  participant,
  videoOnly,
  enableScreenShare,
  videoPriority,
  isLocalParticipant,
  localParticipant,
}: ParticipantTracksProps) {
  const height = useHeight();
  const publications = usePublications(participant);
  const localPublications = usePublications(localParticipant);

  const audioPublication = publications.find((p) => p.kind === "audio") as
    | RemoteAudioTrackPublication
    | LocalAudioTrackPublication
    | undefined;
  const videoPublication = localPublications.find((p) => p.kind === "video") as
    | RemoteVideoTrackPublication
    | LocalVideoTrackPublication
    | undefined;
  const dataPublication = publications.find((p) => p.kind === "data") as
    | RemoteDataTrackPublication
    | LocalDataTrackPublication
    | undefined;
  const videoTrack = useTrack(videoPublication) as IVideoTrack;
  const dimensions = useVideoTrackDimensions(videoTrack);
  const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0);

  return (
    <div
      style={{
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
        zIndex: 2,
        paddingBottom: "50px",
        height: "100%",
        width: "100%",
      }}
    >
      <Publications
        dataPublication={dataPublication}
        audioPublication={audioPublication}
        videoPublication={videoPublication}
        isUsingMarker={isUsingMarker}
        participant={participant}
        isLocalParticipant={isLocalParticipant}
      />
    </div>
  );
}
