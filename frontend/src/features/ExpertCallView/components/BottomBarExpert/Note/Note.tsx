import React from 'react';

import { Box } from '@mui/system';
import { TextField } from '@mui/material';

interface NoteProps {
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  notes: string;
}

export default function Note(props: NoteProps) {
  const { setNotes, notes } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.currentTarget.value);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      <TextField
        label="Notes"
        fullWidth
        variant="outlined"
        multiline
        rows={20}
        sx={{ margin: '20px' }}
        value={notes}
        onChange={event =>
          handleChange(event as React.ChangeEvent<HTMLInputElement>)
        }
      />
    </Box>
  );
}
