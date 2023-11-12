import React from 'react';
import { Typography, Box } from '@mui/material';

interface CallNotesProps {
  notes: string;
}

export default function CallNotes({ notes }: CallNotesProps) {
  return (
    <Box sx={{ width: '300px', height: '100%' }}>
      <Typography sx={{ fontWeight: 'bold', padding: '10px' }}>
        Call Notes
      </Typography>
      <Typography
        sx={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          wordWrap: 'break-word',
        }}
      >
        {notes ? notes : 'No Call Notes'}
      </Typography>
    </Box>
  );
}
