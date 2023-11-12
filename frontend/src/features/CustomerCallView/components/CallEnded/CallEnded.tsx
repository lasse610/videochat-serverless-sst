import React from 'react';
import { Typography, Box } from '@mui/material';

export default function CallEnded() {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ fontWeight: 'bold' }}>
        The call has ended. Thank you for your time. It is safe to close this
        window.
      </Typography>
    </Box>
  );
}
