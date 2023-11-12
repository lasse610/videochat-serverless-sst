import React from 'react';
import { Box } from '@mui/material';
import LogoutButton from '../LogoutButton/LogoutButton';

export default function TopContainer() {
  return (
    <Box
      sx={{
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <LogoutButton />
    </Box>
  );
}
