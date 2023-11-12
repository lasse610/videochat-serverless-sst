import React from 'react';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import { IconButton } from '@mui/material';

import useVideoContext from 'src/hooks/useVideoContext/useVideoContext';
import useLocalAudioToggle from 'src/hooks/useLocalAudioToggle/useLocalAudioToggle';

function AudioToggle() {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <IconButton
      size="small"
      sx={{ color: 'primary.main' }}
      disabled={!hasAudioTrack}
      onClick={toggleAudioEnabled}
    >
      {isAudioEnabled ? <MicNoneOutlinedIcon /> : <MicOffOutlinedIcon />}
    </IconButton>
  );
}

export default AudioToggle;
