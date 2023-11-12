import React from 'react';
import { Box } from '@mui/system';

export default function ExpandingCircle() {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '4px',
        height: '4px',
        borderRadius: '900px',
        backgroundColor: 'rgba(45, 111, 243, 0.5)',
        animation: 'growUp 3s',
        animationIterationCount: 'infinite',
        '@keyframes growUp': {
          '0%': {
            transform: 'scale(40)',
            backgroundColor: 'rgba(45, 111, 243, 0.5)',
          },
          '50%': {
            transform: 'scale(200)',
            backgroundColor: 'rgba(45, 111, 243, 0.3)',
          },
          '100%': {
            transform: 'scale(40)',
            backgroundColor: 'rgba(45, 111, 243, 0.5)',
          },
        },
      }}
    />
  );
}
