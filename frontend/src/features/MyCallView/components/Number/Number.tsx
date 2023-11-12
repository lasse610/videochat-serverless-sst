import { Typography } from '@mui/material';
import React from 'react';

interface NumberProps {
  number: string;
}

export default function Number({ number }: NumberProps) {
  return (
    <Typography
      noWrap
      sx={{ color: 'primary.main', backgroundColor: 'lightGray' }}
    >
      {number}
    </Typography>
  );
}
