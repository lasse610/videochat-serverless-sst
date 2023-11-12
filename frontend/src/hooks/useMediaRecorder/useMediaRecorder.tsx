import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AudioTrack, LocalAudioTrack, VideoTrack } from "twilio-video";
import useMainParticipant from "../useMainParticipant/useMainParticipant";
import useVideoContext from "../useVideoContext/useVideoContext";
import usePublications from "../usePublications/usePublications";
import useTrack from "../useTrack/useTrack";
import {
  uploadFinnishPart,
  uploadVideoFragment,
  requestVideoFragmentUploadUrl,
  VideoFragmentUploadAction,
} from "src/features/api/videos/videos";

import useMediaStreamTrack from "../useMediaStreamTrack/useMediaStreamTrack";

// Must be used inside video context

export default function useMediaRecorder(callId: string | undefined) {
  const [started, setStarted] = useState(false);
  const mediaRecorder = useRef<MediaRecorder>();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const localPublications = usePublications(localParticipant!);
  const localAudioPublication = localPublications.find(
    (pub) => pub.kind === "audio"
  );
  const localAudioTrack = useTrack(localAudioPublication) as LocalAudioTrack;
  const remoteParticipant = useMainParticipant();
  const remotePublications = usePublications(remoteParticipant);
  const remoteAudioTrack = useTrack(
    remotePublications.find((pub) => pub.kind === "audio")
  );
  const remoteVideoTrack = useTrack(
    remotePublications.find((pub) => pub.kind === "video")
  );
  const remoteVideoMediaStream = useMediaStreamTrack(
    remoteVideoTrack as VideoTrack
  );
  const remoteAudioMediaStream = useMediaStreamTrack(
    remoteAudioTrack as AudioTrack
  );
  const localAudioMediaStream = useMediaStreamTrack(localAudioTrack);

  const tracks = useMemo(
    () =>
      remoteAudioMediaStream && remoteVideoMediaStream && localAudioMediaStream
        ? [
            remoteVideoMediaStream,
            remoteAudioMediaStream,
            localAudioMediaStream,
          ]
        : [],
    [remoteVideoMediaStream, remoteAudioMediaStream, localAudioMediaStream]
  );

  const isReady = !!mediaRecorder.current;

  useEffect(() => {
    let newMediaRecorder: MediaRecorder | undefined;
    if (tracks.length > 0 && callId) {
      console.log("creating new mediaRecorder");
      const stream = new MediaStream(tracks);
      const options = { mimeType: "video/webm; codecs=vp9" };
      newMediaRecorder = new MediaRecorder(stream, options);
      newMediaRecorder.ondataavailable = async (blob: BlobEvent) => {
        const response = await requestVideoFragmentUploadUrl(
          VideoFragmentUploadAction.Upload,
          callId
        );
        if (response.data && response.data.presignedUrl) {
          await uploadVideoFragment(response.data.presignedUrl, blob.data);
        } else {
          console.log("failed getting upload url");
        }
      };
      newMediaRecorder.addEventListener("stop", async (event: Event) => {
        console.log("mediarecorder stopped");
        const response = await requestVideoFragmentUploadUrl(
          VideoFragmentUploadAction.Finnish,
          callId
        );
        if (response.data) {
          console.log("video upload ended succesfully");
        } else {
          console.log("failed getting upload url for finnish part");
        }
      });
      mediaRecorder.current = newMediaRecorder;
    }
    return () => {
      if (newMediaRecorder && newMediaRecorder.state === "recording") {
        newMediaRecorder.stop();
      }
      mediaRecorder.current = undefined;
    };
  }, [tracks, callId]);

  const start = useCallback(async () => {
    if (mediaRecorder.current && callId) {
      setStarted(true);
      console.log(mediaRecorder);

      mediaRecorder.current.start(10000);
    }
  }, [mediaRecorder, callId]);

  const stop = useCallback(() => {
    console.log("stop");
    if (mediaRecorder.current) {
      setStarted(false);
      mediaRecorder.current.stop();
    }
  }, []);

  return { start, stop, isReady, started };
}
