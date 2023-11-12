import React from 'react';
import { Box, Typography } from '@mui/material';
export default function TopSection() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
      }}
    >
      <Typography
        sx={{ fontSize: '40px', fontWeight: 'bold', padding: '20px' }}
      >
        Calls
      </Typography>
    </Box>
  );
}
