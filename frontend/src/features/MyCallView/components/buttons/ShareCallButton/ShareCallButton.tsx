import React from 'react';
import { IconButton } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

export default function ShareButton() {
  return (
    <IconButton size="large">
      <ShareOutlinedIcon sx={{ color: 'black' }} />
    </IconButton>
  );
}
