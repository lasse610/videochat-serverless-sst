import {
  DEFAULT_VIDEO_CONSTRAINTS,
  SELECTED_AUDIO_INPUT_KEY,
  SELECTED_VIDEO_INPUT_KEY,
} from '../../../constants';
import { getDeviceInfo, isPermissionDenied } from '../../../utils';
import { useCallback, useState } from 'react';
import Video, {
  LocalDataTrack,
  LocalVideoTrack,
  LocalAudioTrack,
  CreateLocalTrackOptions,
} from 'twilio-video';

export default function useLocalTracks() {
  const [dataTrack, setDataTrack] = useState<LocalDataTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);

  const getLocalDataTrack = useCallback(() => {
    if (!dataTrack) {
      const newTrack: LocalDataTrack = new Video.LocalDataTrack();
      setDataTrack(newTrack);
      return newTrack;
    }
    return dataTrack;
  }, [dataTrack]);

  const getLocalAudioTrack = useCallback((deviceId?: string) => {
    const options: CreateLocalTrackOptions = {};

    if (deviceId) {
      options.deviceId = { exact: deviceId };
    }

    return Video.createLocalAudioTrack(options).then(newTrack => {
      setAudioTrack(newTrack);
      return newTrack;
    });
  }, []);

  const getLocalVideoTrack = useCallback(async () => {
    const selectedVideoDeviceId = window.localStorage.getItem(
      SELECTED_VIDEO_INPUT_KEY
    );

    const { videoInputDevices } = await getDeviceInfo();

    const hasSelectedVideoDevice = videoInputDevices.some(
      device =>
        selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    const options: CreateLocalTrackOptions = {
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      name: `camera-${Date.now()}`,
      ...(hasSelectedVideoDevice && {
        deviceId: { exact: selectedVideoDeviceId! },
      }),
    };

    return Video.createLocalVideoTrack(options).then(newTrack => {
      setVideoTrack(newTrack);
      return newTrack;
    });
  }, []);

  const removeLocalDataTrack = useCallback(() => {
    if (dataTrack) {
      // Should we stop data track somehow?
      setDataTrack(undefined);
    }
  }, [dataTrack]);

  const removeLocalAudioTrack = useCallback(() => {
    if (audioTrack) {
      audioTrack.stop();
      setAudioTrack(undefined);
    }
  }, [audioTrack]);

  const removeLocalVideoTrack = useCallback(() => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(undefined);
    }
  }, [videoTrack]);

  const getAudioAndVideoTracks = useCallback(async () => {
    const {
      audioInputDevices,
      videoInputDevices,
      hasAudioInputDevices,
      hasVideoInputDevices,
    } = await getDeviceInfo();

    if (!hasAudioInputDevices && !hasVideoInputDevices)
      return Promise.resolve();
    if (isAcquiringLocalTracks || audioTrack || videoTrack)
      return Promise.resolve();

    setIsAcquiringLocalTracks(true);

    const selectedAudioDeviceId = window.localStorage.getItem(
      SELECTED_AUDIO_INPUT_KEY
    );
    const selectedVideoDeviceId = window.localStorage.getItem(
      SELECTED_VIDEO_INPUT_KEY
    );

    const hasSelectedAudioDevice = audioInputDevices.some(
      device =>
        selectedAudioDeviceId && device.deviceId === selectedAudioDeviceId
    );
    const hasSelectedVideoDevice = videoInputDevices.some(
      device =>
        selectedVideoDeviceId && device.deviceId === selectedVideoDeviceId
    );

    // In Chrome, it is possible to deny permissions to only audio or only video.
    // If that has happened, then we don't want to attempt to acquire the device.
    //const isCameraPermissionDenied = await isPermissionDenied("");
    //const isMicrophonePermissionDenied = await isPermissionDenied('microphone');

    const shouldAcquireVideo =
      hasVideoInputDevices //&& !isCameraPermissionDenied;
    const shouldAcquireAudio =
      hasAudioInputDevices //&& !isMicrophonePermissionDenied;

    const localTrackConstraints = {
      video: shouldAcquireVideo && {
        ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
        name: `camera-${Date.now()}`,
        ...(hasSelectedVideoDevice && {
          deviceId: { exact: selectedVideoDeviceId! },
        }),
      },
      audio:
        shouldAcquireAudio &&
        (hasSelectedAudioDevice
          ? { deviceId: { exact: selectedAudioDeviceId! } }
          : hasAudioInputDevices),
    };

    return Video.createLocalTracks(localTrackConstraints)
      .then(tracks => {
        const newVideoTrack = tracks.find(
          track => track.kind === 'video'
        ) as LocalVideoTrack;
        const newAudioTrack = tracks.find(
          track => track.kind === 'audio'
        ) as LocalAudioTrack;
        getLocalDataTrack();
        if (newVideoTrack) {
          setVideoTrack(newVideoTrack);
          // Save the deviceId so it can be picked up by the VideoInputList component. This only matters
          // in cases where the user's video is disabled.
          window.localStorage.setItem(
            SELECTED_VIDEO_INPUT_KEY,
            newVideoTrack.mediaStreamTrack.getSettings().deviceId ?? ''
          );
        }
        if (newAudioTrack) {
          setAudioTrack(newAudioTrack);
        }

        // These custom errors will be picked up by the MediaErrorSnackbar component.
        /*
        if (isCameraPermissionDenied && isMicrophonePermissionDenied) {
          const error = new Error();
          error.name = 'NotAllowedError';
          throw error;
        }

        if (isCameraPermissionDenied) {
          throw new Error('CameraPermissionsDenied');
        }

        if (isMicrophonePermissionDenied) {
          throw new Error('MicrophonePermissionsDenied');
        }
        */
      })
      .finally(() => setIsAcquiringLocalTracks(false));
  }, [audioTrack, videoTrack, isAcquiringLocalTracks, getLocalDataTrack]);

  const localTracks = [audioTrack, videoTrack, dataTrack].filter(
    track => track !== undefined
  ) as (LocalAudioTrack | LocalVideoTrack | LocalDataTrack)[];

  return {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    getLocalDataTrack,
    isAcquiringLocalTracks,
    removeLocalDataTrack,
    removeLocalAudioTrack,
    removeLocalVideoTrack,
    getAudioAndVideoTracks,
  };
}
