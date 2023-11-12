import React from 'react';
import CallEndOutlinedIcon from '@mui/icons-material/CallEnd';
import { Button, Typography } from '@mui/material';
import useVideoContext from 'src/hooks/useVideoContext/useVideoContext';

function DisconnectButton() {
  const { room } = useVideoContext();
  return (
    <Button
      onClick={() => room?.disconnect()}
      startIcon={<CallEndOutlinedIcon sx={{ marginLeft: '10px' }} />}
      sx={{
        color: 'error.dark',
        border: 'solid',
        borderRadius: '50px',
        textTransform: 'none',
        maxHeight: '40px',
        '&:hover': {
          color: 'common.white',
          backgroundColor: 'error.dark',
          borderColor: 'error.dark',
        },
      }}
    >
      <Typography
        sx={{ fontSize: '14px', fontWeight: 'bold', marginRight: '10px' }}
      >
        {' '}
        Disconnect
      </Typography>
    </Button>
  );
}

export default DisconnectButton;
