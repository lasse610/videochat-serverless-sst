import React from 'react';
import { useState } from 'react';
import { Avatar, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import ExpandingCircle from '../ExpandingCircle/ExpandingCircle';

export default function CallerInfo() {
  const [callerName, setCallerName] = useState('Lasse Tammela');
  const [companyName, setCompanyName] = useState('Ziptor Oy');

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '10%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        zIndex: 12,
      }}
    >
      <Box sx={{ position: 'relative', top: '50px', left: '-2px', zIndex: -1 }}>
        <ExpandingCircle />
      </Box>
      <Avatar
        sx={{
          width: '80px',
          height: '80px',
          backgroundColor: 'primary.main',
        }}
      >
        LT
      </Avatar>

      <Typography sx={{ color: 'white', textTransform: 'uppercase' }}>
        {callerName}
      </Typography>
      <Typography sx={{ color: 'white' }}>{companyName}</Typography>
    </Box>
  );
}
