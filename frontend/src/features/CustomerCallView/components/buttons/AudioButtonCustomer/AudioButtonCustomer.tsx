import React from 'react';
import { IconButton } from '@mui/material';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';

import useLocalAudioToggle from 'src/hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from 'src/hooks/useVideoContext/useVideoContext';

export default function AudioButtonCustomer(props: { disabled?: boolean }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <IconButton
      disabled={!hasAudioTrack || props.disabled}
      onClick={toggleAudioEnabled}
      sx={{ color: 'grey', backgroundColor: 'white' }}
      size="large">
      {isAudioEnabled ? <MicNoneOutlinedIcon /> : <MicOffOutlinedIcon />}
    </IconButton>
  );
}
