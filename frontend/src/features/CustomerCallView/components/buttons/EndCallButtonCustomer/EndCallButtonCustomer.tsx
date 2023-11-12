import React from 'react';
import { IconButton } from '@mui/material';
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';

import useVideoContext from 'src/hooks/useVideoContext/useVideoContext';

export default function EndCallButtonCustomer() {
  const { room } = useVideoContext();
  return (
    <IconButton
      onClick={() => room!.disconnect()}
      sx={{ color: 'white', backgroundColor: 'error.dark' }}
      size="large">
      <CallEndOutlinedIcon />
    </IconButton>
  );
}
